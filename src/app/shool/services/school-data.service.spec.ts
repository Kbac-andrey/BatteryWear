import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SchoolDataService } from './school-data.service';
import { ISchool, ISchoolGroup } from '../types/school';

describe('SchoolDataService', () => {
  let service: SchoolDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SchoolDataService],
    });
    service = TestBed.inject(SchoolDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created SchoolDataService', () => {
    expect(service).toBeTruthy();
  });

  it('should group schools by academyId', () => {
    const mockSchools: ISchool[] = [
      {
        academyId: 1,
        batteryLevel: 0.8,
        employeeId: '1',
        serialNumber: 'ABC123',
        timestamp: '2023-05-12T12:00:00',
      },
      {
        academyId: 1,
        batteryLevel: 0.6,
        employeeId: '2',
        serialNumber: 'DEF456',
        timestamp: '2023-05-12T12:00:00',
      },
    ];

    const mockExpectedGroups: ISchoolGroup[] = [
      {
        academyId: 1,
        devices: [
          {
            batteryLevel: 0.8,
            employeeId: '1',
            serialNumber: 'ABC123',
            timestamp: '2023-05-12T12:00:00',
          },
          {
            batteryLevel: 0.6,
            employeeId: '2',
            serialNumber: 'DEF456',
            timestamp: '2023-05-12T12:00:00',
          },
        ],
      },
    ];

    service.groupSchoolsByAcademy$().subscribe((result) => {
      expect(result).toEqual(mockExpectedGroups);
    });

    const req = httpMock.expectOne('http://localhost:4200/assets/battery-data.json');

    expect(req.request.method).toBe('GET');
    req.flush(mockSchools);
  });

  it('should emit searched string', () => {
    const mockTestString: string = 'test mission';

    service.searchedString$.subscribe((result) => {
      expect(result).toEqual(mockTestString);
    });

    service.searchString(mockTestString);
  });
});
