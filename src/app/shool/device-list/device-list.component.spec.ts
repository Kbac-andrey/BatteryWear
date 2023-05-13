import { TestBed } from '@angular/core/testing';
import { IDevice, IDeviceGroup, IDeviceInfoResult } from '../types/device';
import { ISchoolGroup } from '../types/school';
import { DeviceListComponent } from './device-list.component';

describe('DeviceListComponent', () => {
  let component: DeviceListComponent;

  const mockSchool: ISchoolGroup = {
      academyId: 1,
      devices: [
        {
          batteryLevel: 0.5,
          employeeId: 'employee1',
          serialNumber: '12345',
          timestamp: '2023-05-12T12:00:00'
        }
      ]
  };
  const mockDevices: IDevice[] = [
    { batteryLevel: 0.8,employeeId: 'emp1', serialNumber: 'SN123', timestamp: '2023-05-01T09:00:00Z'},
    { batteryLevel: 0.5, employeeId: 'emp2', serialNumber: 'SN456',timestamp: '2023-05-01T10:00:00Z'}
  ]


  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [DeviceListComponent]
    });
    component = TestBed.createComponent(DeviceListComponent).componentInstance;
  });

  it('should create the DeviceListComponent', () => {
    const fixture = TestBed.createComponent(DeviceListComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


  it('should group devices by serial number', () => {
    const mockExpectedGroupedDevices: IDeviceGroup = {
      SN123: [
        {
          batteryLevel: 0.8,
          timestamp: '2023-05-01T09:00:00Z',
        }
      ],
      SN456: [
        {
          batteryLevel: 0.5,
          timestamp: '2023-05-01T10:00:00Z',
        },
      ],
    };

    const result = component.groupDevicesBySerialNumber(mockDevices);

    expect(result).toEqual(mockExpectedGroupedDevices);
  });

  it('should return an empty object when no devices are provided', () => {
    const emptyDevices: IDevice[] = [];
    const expectedEmptyGroupedDevices: IDeviceGroup = {};

    const result = component.groupDevicesBySerialNumber(emptyDevices);

    expect(result).toEqual(expectedEmptyGroupedDevices);
  });

  it('should calculate average battery percent per day and return device info with needsReplacement as true when average battery usage per day is greater than 30%', () => {
    const mockGroupedDevices: IDeviceGroup = {
      serialNumber1: [
        { batteryLevel: 1, timestamp: '2023-05-10T08:00:00' },
        { batteryLevel: 0.5, timestamp: '2023-05-11T09:00:00' },
        { batteryLevel: 0.25, timestamp: '2023-05-12T09:30:00' },
      ]
    };

    const mockExpectedResults: IDeviceInfoResult[] = [
      {
        serialNumber: 'serialNumber1',
        averageBatteryPercentPerDay: 36,
        needsReplacement: true,
      },
    ];

    const result = component.calculateDevicesBatteryIssues(mockGroupedDevices);


    expect(result).toEqual(mockExpectedResults);
  });

  it('should calculate average battery percent per day  and return device info with needsReplacement as false when average battery usage per day is less  30%', () => {
    const mockGroupedDevices: IDeviceGroup = {
      serialNumber1: [
        { batteryLevel: 1, timestamp: '2023-05-10T08:00:00' },
        { batteryLevel: 0.9, timestamp: '2023-05-11T09:00:00' },
        { batteryLevel: 0.85, timestamp: '2023-05-12T09:30:00' },
      ]
    };

    const mockExpectedResults: IDeviceInfoResult[] = [
      {
        serialNumber: 'serialNumber1',
        averageBatteryPercentPerDay: 7,
        needsReplacement: false,
      },
    ];

    const result = component.calculateDevicesBatteryIssues(mockGroupedDevices);


    expect(result).toEqual(mockExpectedResults);
  });

  it('should calculate average battery percent per day if the battery level increases between measurements and return device info with needsReplacement as false when average battery usage per day is less  30%', () => {
    const mockGroupedDevices: IDeviceGroup = {
      serialNumber1: [
        { batteryLevel: 1, timestamp: '2023-05-10T09:00:00' },
        { batteryLevel: 0.9, timestamp: '2023-05-10T21:00:00' },
        { batteryLevel: 0.8, timestamp: '2023-05-11T21:00:00' },
        { batteryLevel: 1, timestamp: '2023-05-11T22:00:00' },
      ]
    };

    const mockExpectedResults: IDeviceInfoResult[] = [
      {
        serialNumber: 'serialNumber1',
        averageBatteryPercentPerDay: 13,
        needsReplacement: false,
      },
    ];

    const result = component.calculateDevicesBatteryIssues(mockGroupedDevices);

    expect(result).toEqual(mockExpectedResults);
  });


  it('should handle a single device with unknown values', () => {
    const mockGroupedDevices: IDeviceGroup = {
      serialNumber1: [
        { batteryLevel: 50, timestamp: '2023-05-10T08:00:00' },
      ],
    };

    const mockExpectedResults: IDeviceInfoResult[] = [
      {
        serialNumber: 'serialNumber1',
        averageBatteryPercentPerDay: 'unknown',
        needsReplacement: 'unknown',
      },
    ];

    const result = component.calculateDevicesBatteryIssues(mockGroupedDevices);

    expect(result).toEqual(mockExpectedResults);
  });
});
