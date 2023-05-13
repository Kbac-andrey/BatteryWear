import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SchoolDataService } from '../services/school-data.service';
import { ISchoolGroup } from '../types/school';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss'],
})
export class SchoolListComponent implements OnInit, OnDestroy {
  public schools: ISchoolGroup[] = [];
  public filteredSchools: ISchoolGroup[] = [];

  private _groupSchoolsSubscription: Subscription;
  private _searchedStringSubscription: Subscription;

  constructor(private _schoolDataService: SchoolDataService) {}

  public ngOnInit(): void {
    this._groupSchoolsSubscription = this._schoolDataService
      .groupSchoolsByAcademy$()
      .subscribe((schools: ISchoolGroup[]) => {
        this.schools = schools;
        this.filteredSchools = [...this.schools];
      });

    this._searchedStringSubscription =
      this._schoolDataService.searchedString$.subscribe(
        (searchString: string) =>
          (this.filteredSchools = this.schools.filter((school: ISchoolGroup) =>
            school.academyId.toString().includes(searchString)
          ))
      );
  }

  public ngOnDestroy(): void {
    if (this._groupSchoolsSubscription) {
      this._groupSchoolsSubscription.unsubscribe();
    }
    if (this._searchedStringSubscription) {
      this._searchedStringSubscription.unsubscribe();
    }
  }
}
