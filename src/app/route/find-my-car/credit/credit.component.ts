import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IStore } from 'app/shared/interfaces/store.interface';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import {
  BUYING_METHOD_LIST,
  BUYING_TIME_LIST,
  CREDIT_ASSESSMENT_LIST,
  FIND_STEP_BRAND,
  FIND_STEP_CREDIT,
  FIND_STEP_REVIEW_INFO,
  FIND_STEP_THANKS,
} from 'app/core/constant';

import { CreateRequestService } from 'app/shared/services/create-request.service';
import { NotificationService } from 'app/shared/services/notification.service';

import * as AuthActions from 'app/shared/states/auth/auth.actions';
import * as RequestActions from 'app/shared/states/request/request.actions';
import * as UiActions from 'app/shared/states/ui/ui.actions';

import { IProfile } from 'app/shared/states/auth/auth.interfaces';
import { IRequest } from 'app/shared/states/request/request.interface';
import { ITrim } from 'app/shared/states/trim/trim.interfaces';
import { INavigator } from 'app/shared/states/ui/ui.interface';

import { getUserData } from 'app/shared/states/auth/auth.selectors';
import {
  getSelectedExteriorColorList,
  getSelectedInteriorColorList,
} from 'app/shared/states/colors/colors.selectors';
import { getSelectedoptions } from 'app/shared/states/options/options.selectors';
import { getCredetScore } from 'app/shared/states/request/request.selectors';
import { getState } from 'app/shared/states/request/request.selectors';
import { selectCurrentTrim } from 'app/shared/states/trim/trim.selectors';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss'],
})
export class CreditComponent implements OnInit, OnDestroy {
  private pageTitle = 'Credit Assessment';
  public firstFindStep = FIND_STEP_BRAND;
  public prevFindStep = FIND_STEP_REVIEW_INFO;
  public currentFindStep = FIND_STEP_CREDIT;
  public nextFindStep = FIND_STEP_THANKS;

  private onDestroy$ = new Subject<void>();
  public creditScore$: Observable<number>;
  public navButtonClick$: Observable<INavigator>;

  public request$: Observable<IRequest>;
  public request: IRequest;

  public userData$: Observable<IProfile>;
  public userData: IProfile;

  public selectedId = null;
  public showErrorMsg = false;
  public creditAssessmentList = [];

  public selectedTrim$: Observable<ITrim>;
  public selectedInteriorColors$: Observable<Array<number>>;
  public selectedExteriorColors$: Observable<Array<number>>;
  public selectedOptions$: Observable<Array<number>>;

  public selectedVehicles: Array<number> = new Array<number>();
  public selectedInteriorColors: Array<number>;
  public selectedExteriorColors: Array<number>;
  public selectedOptions: Array<number>;

  constructor(
    private store$: Store<IStore>,
    private router$: Router,
    private notificationService$: NotificationService,
    private createRequestService$: CreateRequestService
  ) {}

  ngOnInit() {
    this.initSubHeader();
    this.creditAssessmentList = CREDIT_ASSESSMENT_LIST
      ? CREDIT_ASSESSMENT_LIST
      : [];
    // get selected score
    this.creditScore$ = this.store$.select(getCredetScore);
    this.creditScore$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(selectedId => {
          this.selectedId = selectedId;
        })
      )
      .subscribe();
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

    this.selectedTrim$ = this.store$.select(selectCurrentTrim);
    this.selectedInteriorColors$ = this.store$.select(
      getSelectedInteriorColorList
    );
    this.selectedExteriorColors$ = this.store$.select(
      getSelectedExteriorColorList
    );
    this.selectedOptions$ = this.store$.select(getSelectedoptions);
    this.request$ = this.store$.select(getState);

    this.store$.dispatch(new AuthActions.FetchUserData());
    this.userData$ = this.store$.pipe(select(getUserData));

    this.selectedTrim$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(trim =>
          trim.VehicleInventories.forEach(obj =>
            this.selectedVehicles.push(obj.vehicle_id)
          )
        )
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

    this.request$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(req => (this.request = req))
      )
      .subscribe();

    this.userData$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => {
          if (data !== undefined) {
            this.userData = data;
          }
        })
      )
      .subscribe();
  }

  onNavButtonClick(data: INavigator) {
    if (data.click && data.type === 'next') {
      if (this.selectedId === null) {
        this.notificationService$.error(
          'Please make a selection in order to continue.'
        );
        return;
      }
      const userCarInfo: UserCarInfo = {};
      userCarInfo.own_a_car = this.request.user_car_information.own_a_car;
      if (this.request.user_car_information.brand_id) {
        userCarInfo.brand_id = this.request.user_car_information.brand_id;
      }
      if (this.request.user_car_information.lease_end_date) {
        userCarInfo.lease_end_date = this.request.user_car_information.lease_end_date;
      }
      if (this.request.user_car_information.miles) {
        userCarInfo.miles = this.request.user_car_information.miles;
      }
      if (this.request.user_car_information.model_id) {
        userCarInfo.model_id = this.request.user_car_information.model_id;
      }
      if (this.request.user_car_information.term_in_months) {
        userCarInfo.term_in_months = this.request.user_car_information.term_in_months;
      }
      if (this.request.user_car_information.will_trade) {
        userCarInfo.will_trade = this.request.user_car_information.will_trade;
      }
      if (this.request.user_car_information.year) {
        userCarInfo.year = this.request.user_car_information.year;
      }
      const requestObj = {
        vehicles: this.selectedVehicles,
        interior_colors: this.selectedInteriorColors,
        exterior_colors: this.selectedExteriorColors,
        option_preferences: this.selectedOptions,
        ...this.request,
        user_car_information: userCarInfo,
        buying_time: BUYING_TIME_LIST[this.request.buying_time].label,
        buying_method: BUYING_METHOD_LIST[this.request.buying_method].label,
        credit_score: CREDIT_ASSESSMENT_LIST[this.selectedId].score,
        user_id: this.userData.id,
        referral_code: this.request.referral_code.join(','),
      };
      this.store$.dispatch(new UiActions.ClearNavigateState());
      this.createRequestService$
        .createRequestFromPreference(requestObj)
        .subscribe(req => {
          this.goToNextStep();
        });
    }
    if (data.click && data.type === 'previous') {
      this.store$.dispatch(new UiActions.ClearNavigateState());
      this.goToPrevStep();
    }
  }

  goToNextStep() {
    this.store$.dispatch(new RequestActions.SetCreditScore(this.selectedId));
    this.router$.navigate(['find-my-car/' + this.nextFindStep]);
  }

  goToPrevStep() {
    this.store$.dispatch(new RequestActions.SetCreditScore(this.selectedId));
    this.router$.navigate(['find-my-car/' + this.prevFindStep]);
  }

  initSubHeader() {
    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.SetShowNextButton(true));
    this.store$.dispatch(new UiActions.SetShowPrevButton(true));
    this.store$.dispatch(new UiActions.SetShowStepper(false));
    this.store$.dispatch(new UiActions.SetShowSearchBox(false));
  }

  onSelectScore(credit_id: number) {
    this.selectedId = credit_id;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

interface UserCarInfo {
  [key: string]: any;
}
