import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IStore } from 'app/shared/interfaces/store.interface';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import * as OptionActions from 'app/shared/states/options/options.actions';
import { IRequestFecthList } from 'app/shared/states/options/options.interfaces';
import { IOption } from 'app/shared/states/options/options.interfaces';
import { ITrim } from 'app/shared/states/trim/trim.interfaces';
import { selectCurrentTrim } from 'app/shared/states/trim/trim.selectors';
import * as UiActions from 'app/shared/states/ui/ui.actions';
import { INavigator } from 'app/shared/states/ui/ui.interface';

import {
  getoptionsAsArray,
  getSelectedoptions,
} from 'app/shared/states/options/options.selectors';

import {
  FIND_STEP_BRAND,
  FIND_STEP_COLOR,
  FIND_STEP_REVIEW,
  FIND_STEP_SPEC,
} from 'app/core/constant';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit, OnDestroy {
  private pageTitle = 'Preferred Options';
  public firstFindStep = FIND_STEP_BRAND;
  public prevFindStep = FIND_STEP_COLOR;
  public currentFindStep = FIND_STEP_SPEC;
  public nextFindStep = FIND_STEP_REVIEW;

  private onDestroy$ = new Subject<void>();
  public fetching$: Observable<boolean>;
  public didFetch$: Observable<boolean>;
  public navButtonClick$: Observable<INavigator>;
  public selectedOptions$: Observable<Array<number>>;
  public options$: Observable<Array<IOption>>;
  public selectedTrim$: Observable<ITrim>;

  public selectedOptions: Array<number> = [];
  public options: Array<IOption> = [];
  public selectionStatus: Array<boolean> = [];

  constructor(
    private store$: Store<IStore>,
    private router$: Router,
    private notificationService$: NotificationService
  ) {}

  ngOnInit() {
    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetShowNextButton(true));
    this.store$.dispatch(new UiActions.SetCurrentPage(this.currentFindStep));
    this.store$.dispatch(new UiActions.SetNextPage(this.nextFindStep));
    this.store$.dispatch(new UiActions.SetPrevPage(this.prevFindStep));
    this.store$.dispatch(new UiActions.SetShowStepper(true));

    this.fetching$ = this.store$.pipe(select(state => state.option.fetching));
    this.didFetch$ = this.store$.pipe(select(state => state.option.didFetch));

    this.options$ = this.store$.select(getoptionsAsArray);
    this.selectedOptions$ = this.store$.select(getSelectedoptions);

    this.options$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(options => {
          this.options = options;
          if (!this.selectionStatus.length) {
            options.forEach(() => {
              this.selectionStatus.push(false);
            });
          }
        })
      )
      .subscribe();

    this.selectedOptions$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(options => {
          this.selectedOptions = options;
          for (let i = 0; i < this.selectionStatus.length; i++) {
            if (options.find(option => option === i + 1)) {
              this.selectionStatus[i] = true;
            }
          }
        })
      )
      .subscribe();

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
    this.selectedTrim$ = this.store$.select(selectCurrentTrim);
    this.selectedTrim$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(trim => {
          this.loadOptions(trim);
        })
      )
      .subscribe();
  }

  loadOptions(trim) {
    const request: IRequestFecthList = {
      vehicles:
        trim && trim['VehicleInventories']
          ? trim['VehicleInventories'].map(item => item['vehicle_id'])
          : [60],
    };

    this.didFetch$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(
          didFetch =>
            !didFetch &&
            this.store$.dispatch(new OptionActions.FetchOptionList(request))
        )
      )
      .subscribe();
  }

  onNavButtonClick(data: INavigator) {
    if (data.click && data.type === 'next') {
      this.store$.dispatch(new UiActions.ClearNavigateState());
      if (!this.selectedOptions.length) {
        this.notificationService$.error(
          'Please select at least one preferred option!'
        );
      } else {
        this.goToNextStep();
      }
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  goToNextStep() {
    this.store$.dispatch(new UiActions.SetLastStep(this.currentFindStep));
    this.router$.navigate(['find-my-car/' + this.nextFindStep]);
  }

  goToFirstStep() {
    this.router$.navigate(['find-my-car/' + this.firstFindStep]);
  }

  getColumn(options, index) {
    const column = [];
    for (let i = index * 4; i < index * 4 + 4; i++) {
      column.push(options[i]);
    }
    return column;
  }

  getColumns() {
    const columns = new Array<number>(
      Math.ceil(this.selectionStatus.length / 4)
    );
    return columns;
  }

  onCheckOption(e, id: number) {
    this.selectionStatus[id - 1] = !this.selectionStatus[id - 1];
    this.store$.dispatch(
      new OptionActions.SelectOption({
        id: id,
        checked: e.target.checked,
      })
    );
  }
}
