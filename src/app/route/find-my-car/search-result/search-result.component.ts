import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { IStore } from 'app/shared/interfaces/store.interface';
import { SearchResultService } from 'app/shared/services/search-result.service';
import {
  getSelectedExteriorColorList,
  getSelectedInteriorColorList,
} from 'app/shared/states/colors/colors.selectors';
import { getSelectedoptions } from 'app/shared/states/options/options.selectors';
import { selectCurrentTrimId } from 'app/shared/states/trim/trim.selectors';
import * as UiActions from 'app/shared/states/ui/ui.actions';

import {
  FIND_STEP_BRAND,
  FIND_STEP_REVIEW,
  FIND_STEP_REVIEW_INFO,
  FIND_STEP_SEARCH_RESULT,
} from 'app/core/constant';
import { AuthServiceImpl } from 'app/shared/states/auth/auth.service';
import { INavigator } from 'app/shared/states/ui/ui.interface';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  private pageTitle = 'Search Results';
  public firstFindStep = FIND_STEP_BRAND;
  public prevFindStep = FIND_STEP_REVIEW;
  public currentFindStep = FIND_STEP_SEARCH_RESULT;
  public nextFindStep = FIND_STEP_REVIEW_INFO;

  private onDestroy$ = new Subject<void>();
  public searchResult$: Observable<any>;
  public selectedTrimId$: Observable<number>;
  public selectedInteriorColors$: Observable<Array<number>>;
  public selectedExteriorColors$: Observable<Array<number>>;
  public selectedOptions$: Observable<Array<number>>;
  public count: number;

  public navButtonClick$: Observable<INavigator>;

  public vehicle: Array<number> = new Array<number>();
  public selectedInteriorColors: Array<number>;
  public selectedExteriorColors: Array<number>;
  public selectedOptions: Array<number>;

  constructor(
    private store$: Store<IStore>,
    public service: SearchResultService,
    private router$: Router,
    private authService: AuthServiceImpl
  ) {}

  ngOnInit() {
    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetShowNextButton(true));
    if (this.isLoggedIn()) {
      this.store$.dispatch(new UiActions.SetShowNextLabel('Submit My Request'));
    }
    this.store$.dispatch(new UiActions.SetShowPrevButton(true));
    this.store$.dispatch(new UiActions.SetShowStepper(false));
    this.store$.dispatch(new UiActions.SetShowCancelSearch(true));
    this.selectedTrimId$ = this.store$.select(selectCurrentTrimId);
    this.selectedInteriorColors$ = this.store$.select(
      getSelectedInteriorColorList
    );
    this.selectedExteriorColors$ = this.store$.select(
      getSelectedExteriorColorList
    );
    this.selectedOptions$ = this.store$.select(getSelectedoptions);
    this.selectedTrimId$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(modelId => this.vehicle.push(modelId))
      )
      .subscribe();

    this.selectedInteriorColors$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(colors => (this.selectedInteriorColors = colors))
      )
      .subscribe();

    this.selectedExteriorColors$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(colors => (this.selectedExteriorColors = colors))
      )
      .subscribe();

    this.selectedOptions$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(options => {
          this.selectedOptions = options;
        })
      )
      .subscribe();

    const requestObj = {
      vehicles: this.vehicle,
      interior_colors: this.selectedInteriorColors,
      exterior_colors: this.selectedExteriorColors,
      option_preferences: this.selectedOptions,
    };

    this.service
      .fetchSearchResult(requestObj)
      .subscribe(data => (this.count = data.count));

    // next button clicked
    this.navButtonClick$ = this.store$.pipe(
      select(state => state.ui.navigateButtonClick)
    );

    this.navButtonClick$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => {
          this.onNavButtonClick(data);
        })
      )
      .subscribe();
  }

  onNavButtonClick(data) {
    if (data.click && data.type === 'next') {
      this.goToNextStep();
    }
    if (data.click && data.type === 'previous') {
      this.goToPrevStep();
    }
  }

  goToNextStep() {
    this.store$.dispatch(new UiActions.ClearNavigateState());
    if (!this.isLoggedIn()) {
      this.router$.navigate(['register']);
      return;
    }
    this.router$.navigate(['find-my-car/' + this.nextFindStep]);
  }
  goToPrevStep() {
    this.store$.dispatch(new UiActions.ClearNavigateState());
    this.router$.navigate(['find-my-car/' + this.prevFindStep]);
  }

  isLoggedIn() {
    return this.authService.getToken();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
