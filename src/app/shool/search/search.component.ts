import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { SchoolDataService } from '../services/school-data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  public readonly PLACEHOLDER_TEXT: string = 'Search academy by id...';

  public academyControl = new FormControl();

  private _destroy$$ = new Subject<void>();

  constructor(private _schoolDataService: SchoolDataService) {}

  public ngOnInit(): void {
    this.academyControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this._destroy$$)
      )
      .subscribe((searchString: string) => {
        this._schoolDataService.searchString(searchString);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$$.next();
    this._destroy$$.complete();
  }
}
