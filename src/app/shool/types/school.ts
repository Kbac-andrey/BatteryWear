import { IDevice } from "./device";

export interface ISchool {
  academyId: number,
  batteryLevel: number,
  employeeId: string,
  serialNumber: string,
  timestamp: string
}

export interface ISchoolGroup {
  academyId: number;
  devices: IDevice[];
}
