import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISchool, ISchoolGroup } from '../types/school';
import { Observable, of, Subject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SchoolDataService {
  private _searchedStringSource$$ = new Subject<string>();

  searchedString$ = this._searchedStringSource$$.asObservable();

  constructor(private _http: HttpClient) {}

  public groupSchoolsByAcademy$(): Observable<ISchoolGroup[]> {
    return this._getSchools$().pipe(
      switchMap((schools: ISchool[]) => {
        const schoolGroups: ISchoolGroup[] = schools.reduce(
          (schoolGroups: ISchoolGroup[], school: ISchool) => {
            const { academyId, ...device } = school;
            const matchedSchool = schoolGroups.find(
              (existingSchoolGroup: ISchoolGroup) =>
                existingSchoolGroup.academyId === academyId
            );

            if (!matchedSchool) {
              schoolGroups.push({
                academyId,
                devices: [device],
              });
            } else {
              matchedSchool.devices = [...matchedSchool.devices, device];
            }

            return schoolGroups;
          },
          []
        );

        return of(schoolGroups);
      })
    );
  }

  public searchString(mission: string): void {
    this._searchedStringSource$$.next(mission);
  }

  private _getSchools$(): Observable<ISchool[]> {
    return this._http.get<ISchool[]>('http://localhost:4200/assets/battery-data.json');
  }
}
