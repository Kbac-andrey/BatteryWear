export interface IDevice {
  batteryLevel: number;
  employeeId: string;
  serialNumber: string;
  timestamp: string;
}

export interface IDeviceGroped {
  batteryLevel: number;
  timestamp: string;
}

 export interface IDeviceInfoResult {
  serialNumber: string;
  averageBatteryPercentPerDay: number | 'unknown';
  needsReplacement: boolean | 'unknown';
}

export interface IDeviceGroup {
  [serialNumber: string]: IDeviceGroped[];
}
