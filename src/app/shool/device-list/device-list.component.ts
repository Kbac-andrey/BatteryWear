import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IDevice, IDeviceGroped, IDeviceGroup, IDeviceInfoResult } from '../types/device';
import { ISchoolGroup } from '../types/school';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceListComponent {
  @Input() public set school(currentSchool: ISchoolGroup) {
    this._currentSchool = currentSchool;
    this._groupedDevicesBySerialNumber = this.groupDevicesBySerialNumber(this._currentSchool.devices);
    this.deviceInfo = this.calculateDevicesBatteryIssues(this._groupedDevicesBySerialNumber);
  }

  public readonly COLUMNS: string[] = ['serialNumber', 'averageBatteryPercentPerDay', 'status'];


  public deviceInfo: IDeviceInfoResult[];

  private _currentSchool: ISchoolGroup;
  private _groupedDevicesBySerialNumber: IDeviceGroup;

  public groupDevicesBySerialNumber(devices: IDevice[]): IDeviceGroup {
    return devices.reduce((groups: IDeviceGroup, device: IDevice) => {
      const serialNumber: string = device.serialNumber;
      const { batteryLevel, timestamp } = device;

      if (!groups[serialNumber]) {
        groups[serialNumber] = [];
      }

      groups[serialNumber].push({ batteryLevel, timestamp });

      return groups;
    }, {});
  }

  public calculateDevicesBatteryIssues(groupedDevices: IDeviceGroup): IDeviceInfoResult[] {
    const batteryThreshold: number = 30;
    const deviceGroups: IDeviceInfoResult[] = Object.entries(groupedDevices).map(([serialNumber, deviceData]: [string, IDeviceGroped[]]) => {
      if (deviceData.length === 1) {
        return {
          serialNumber,
          averageBatteryPercentPerDay: 'unknown',
          needsReplacement: 'unknown',
        };
      }

      const totalBatteryChanges: number[] = this._calculateTotalBatteryChanges(deviceData);

      const averageBatteryPercentPerDay: number = Math.floor(
        totalBatteryChanges.reduce((sum, change) => sum + change, 0) / totalBatteryChanges.length
      );

      const needsReplacement: boolean = averageBatteryPercentPerDay > batteryThreshold;

      return {
        serialNumber,
        averageBatteryPercentPerDay,
        needsReplacement,
      };
    });

    return deviceGroups;
  }

  private _calculateTotalBatteryChanges(deviceData: IDeviceGroped[]): number[] {
    const batteryChanges: number[] = [];

    for (let i = 0; i < deviceData.length - 1; i++) {
      const currentReading: IDeviceGroped = deviceData[i];
      const nextReading: IDeviceGroped = deviceData[i + 1];

      const currentBatteryLevel: number = currentReading.batteryLevel;
      const nextBatteryLevel: number = nextReading.batteryLevel;

      if (nextBatteryLevel - currentBatteryLevel > 0) {
        const timestampDiff: number = this._calculateTimestampDiff(currentReading.timestamp, deviceData[0].timestamp);

        if (timestampDiff > 0) {
          const batteryDiff: number = this._calculateBatteryDiff(deviceData[0].batteryLevel, currentReading.batteryLevel);
          const averageBatteryUsagePerDay: number = this._calculateAverageBatteryUsagePerDay(batteryDiff, timestampDiff);
          batteryChanges.push(averageBatteryUsagePerDay);
        }

        deviceData[0] = nextReading;
      }
    }

    const lastDevice: IDeviceGroped = deviceData[deviceData.length - 1];
    const timestampDiff: number = this._calculateTimestampDiff(lastDevice.timestamp, deviceData[0].timestamp);
    const batteryDiff: number = this._calculateBatteryDiff(deviceData[0].batteryLevel, lastDevice.batteryLevel);
    const averageBatteryUsagePerDay: number = this._calculateAverageBatteryUsagePerDay(batteryDiff, timestampDiff);

    if (timestampDiff > 0) {
      batteryChanges.push(averageBatteryUsagePerDay);
    }

    return batteryChanges;
  }

  private _calculateTimestampDiff(timestamp1: string, timestamp2: string): number {
    return new Date(timestamp1).getTime() - new Date(timestamp2).getTime()
  }

  private _calculateBatteryDiff(batteryLevel1: number, batteryLevel2: number): number {
    return batteryLevel1 - batteryLevel2;
  }

  private _calculateAverageBatteryUsagePerDay(batteryDiff: number, timestampDiff: number): number {
    return (batteryDiff / timestampDiff * 1000 * 60 * 60) * 24 * 100;
  }
}
