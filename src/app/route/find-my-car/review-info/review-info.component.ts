import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { range } from 'rxjs/observable/range';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import {
  FIND_STEP_BRAND,
  FIND_STEP_CREDIT,
  FIND_STEP_REVIEW_INFO,
  FIND_STEP_SEARCH_RESULT,
  OWN_CAR,
  WILL_TRADE,
} from 'app/core/constant';

import * as AuthActions from 'app/shared/states/auth/auth.actions';
import * as LeaseActions from 'app/shared/states/lease/lease.actions';
import * as RequestActions from 'app/shared/states/request/request.actions';
import * as UiActions from 'app/shared/states/ui/ui.actions';

import { IStore } from 'app/shared/interfaces/store.interface';
import { IProfile } from 'app/shared/states/auth/auth.interfaces';
import { IBrand } from 'app/shared/states/brands/brands.interfaces';
import { ILeaseGroup } from 'app/shared/states/lease/lease.interfaces';
import {
  IModel,
  IRequestFecthList,
} from 'app/shared/states/models/models.interfaces';
import { IRequest } from 'app/shared/states/request/request.interface';
import { ITrim } from 'app/shared/states/trim/trim.interfaces';
import { INavigator } from 'app/shared/states/ui/ui.interface';

import { getUserData } from 'app/shared/states/auth/auth.selectors';
import {
  getBrandsAsArray,
  selectCurrentBrand,
} from 'app/shared/states/brands/brands.selectors';
import {
  IColorExterior,
  IColorInterior,
} from 'app/shared/states/colors/colors.interfaces';
import {
  selectCurrentExteriorColors,
  selectCurrentInteriorColors,
} from 'app/shared/states/colors/colors.selectors';
import { getBackgroundImage } from 'app/shared/states/colors/colors.selectors';
import { selectCurrentModel } from 'app/shared/states/models/models.selectors';
import { getState } from 'app/shared/states/request/request.selectors';
import { selectCurrentTrim } from 'app/shared/states/trim/trim.selectors';

import { AuthServiceImpl } from 'app/shared/states/auth/auth.service';
import { ModelsServiceImpl } from 'app/shared/states/models/models.service';

@Component({
  selector: 'app-review-info',
  templateUrl: './review-info.component.html',
  styleUrls: ['./review-info.component.scss'],
})
export class ReviewInfoComponent implements OnInit, OnDestroy {
  private pageTitle = 'Review Your Info';
  public firstFindStep = FIND_STEP_BRAND;
  public prevFindStep = FIND_STEP_SEARCH_RESULT;
  public currentFindStep = FIND_STEP_REVIEW_INFO;
  public nextFindStep = FIND_STEP_CREDIT;

  public userName = 'User Name';

  private onDestroy$ = new Subject<void>();
  public backgroundImage$: Observable<string>;

  public userData$: Observable<IProfile>;
  public selectedBrand$: Observable<IBrand>;
  public selectedModel$: Observable<IModel>;
  public selectedTrim$: Observable<ITrim>;
  public request$: Observable<IRequest>;
  public selectedExteriorColors$: Observable<IColorExterior[]>;
  public selectedInteriorColors$: Observable<IColorInterior[]>;
  public navButtonClick$: Observable<INavigator>;
  public lease$: Observable<ILeaseGroup>;
  public brands$: Observable<IBrand[]>;
  public models$: Observable<IModel[]>;

  public selectedBrandName: string;
  public selectedModelInfo: any;
  public selectedTrim: ITrim;
  public request: IRequest;
  public selectedExteriorColors: IColorExterior[];
  public selectedInteriorColors: IColorInterior[];

  public lease: ILeaseGroup = null;

  public bsDatePickerConfig = {
    dateInputFormat: 'DD, MMMM YYYY',
    containerClass: 'theme-orange',
  };

  public leaseModes = [];
  public currentLeaseMode;
  public tradeModes = [];
  public currentTradeMode;
  public yearList = [];
  public currentYear;
  public brandList: IBrand[];
  public currentBrand;
  public modelList: IModel[];
  public currentModel;
  public miles: number;
  public leaseTerm: number;
  public leaseEndDate: string;
  public minDate: any;
  public fromLease: boolean;
  public firstName: string;
  public loaded = false;

  constructor(
    private store$: Store<IStore>,
    private router$: Router,
    public modelService: ModelsServiceImpl,
    public authService: AuthServiceImpl
  ) {}

  ngOnInit() {
    this.initSubHeader();

    this.userData$ = this.store$.pipe(select(getUserData));

    this.store$.dispatch(new AuthActions.FetchUserData());
    this.store$.dispatch(
      new LeaseActions.FetchLeaseInfo({ user_id: this.authService.getUserID() })
    );
    this.backgroundImage$ = this.store$.select(getBackgroundImage);
    this.selectedBrand$ = this.store$.select(selectCurrentBrand);
    this.selectedModel$ = this.store$.select(selectCurrentModel);
    this.selectedTrim$ = this.store$.select(selectCurrentTrim);
    this.request$ = this.store$.select(getState);
    this.selectedExteriorColors$ = this.store$.select(
      selectCurrentExteriorColors
    );
    this.selectedInteriorColors$ = this.store$.select(
      selectCurrentInteriorColors
    );
    this.navButtonClick$ = this.store$.pipe(
      select(state => state.ui.navigateButtonClick)
    );
    this.lease$ = this.store$.select(store => store.lease);
    this.brands$ = this.store$.select(getBrandsAsArray);

    this.getData();
    this.initDropdowns();
  }

  getData() {
    this.userData$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => {
          if (data !== undefined) {
            this.userName = data.first_name;
          }
        })
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

    this.selectedBrand$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(brand => (this.selectedBrandName = brand ? brand.name : null))
      )
      .subscribe();

    this.selectedModel$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(
          model =>
            (this.selectedModelInfo = model
              ? {
                  name: model.name,
                  image: model.image_url,
                  minPrice: model.min_price,
                }
              : null)
        )
      )
      .subscribe();

    this.selectedTrim$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(trim => (this.selectedTrim = trim ? trim : null))
      )
      .subscribe();

    this.navButtonClick$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => {
          this.onNavButtonClick(data);
        })
      )
      .subscribe();

    this.brands$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => (this.brandList = data))
      )
      .subscribe();

    this.request$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(req => {
          if (req !== null) {
            this.fromLease = req.user_car_information.own_a_car === null;
            this.request = req;
            this.initDropdownValues(true);
          }
        })
      )
      .subscribe();

    this.lease$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => {
          if (data !== null) {
            this.lease = data;
            this.initDropdownValues(true);
          }
        })
      )
      .subscribe();
  }

  initSubHeader() {
    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetShowNextButton(true));
    this.store$.dispatch(new UiActions.SetShowPrevButton(true));
    this.store$.dispatch(new UiActions.SetShowStepper(false));
    this.store$.dispatch(new UiActions.SetCurrentPage(this.currentFindStep));
    this.store$.dispatch(new UiActions.SetPrevPage(this.prevFindStep));
  }

  initDropdowns() {
    this.leaseModes = OWN_CAR ? OWN_CAR : [];
    this.tradeModes = WILL_TRADE ? WILL_TRADE : [];
    range(1990, new Date().getFullYear() - 1989).subscribe(year =>
      this.yearList.push(year)
    );
    this.yearList = this.yearList.reverse();

    this.minDate = new Date();
  }

  initDropdownValues(isFirst: boolean) {
    if (this.fromLease && this.lease !== null) {
      if (isFirst) {
        this.currentLeaseMode = this.lease.own_a_car;
      }
      this.currentTradeMode = this.lease.will_trade;
      this.currentYear = this.lease.year ? this.lease.year : null;
      this.currentBrand = this.lease.brand_id;
      this.miles = this.lease.miles ? this.lease.miles : null;
      this.leaseTerm = this.lease.term_in_months;
      this.leaseEndDate = this.lease.lease_end_date;
    } else if (!this.fromLease) {
      const { user_car_information } = this.request;
      if (isFirst) {
        this.currentLeaseMode = user_car_information.own_a_car;
      }
      this.currentTradeMode = user_car_information.will_trade;
      this.currentYear = user_car_information.year
        ? user_car_information.year
        : null;
      this.currentBrand = user_car_information.brand_id
        ? user_car_information.brand_id
        : null;
      this.miles = user_car_information.miles
        ? user_car_information.miles
        : null;
      this.leaseTerm = user_car_information.term_in_months;
      this.leaseEndDate = user_car_information.lease_end_date;
    }
    this.modelList = [];
    this.onChangeBrand();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  goToFirstStep() {
    this.router$.navigate(['find-my-car/' + this.firstFindStep]);
  }

  onChangeBrand() {
    this.currentModel = null;
    this.brands$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(brands => {
          const selectedBrands = brands.filter(
            brand => brand.id === this.currentBrand
          );

          if (selectedBrands.length) {
            const selectedBrand = selectedBrands[0];
            const request: IRequestFecthList = {
              brand_id: selectedBrand.id,
              min_price: selectedBrand.min_price,
              max_price: selectedBrand.max_price,
            };

            this.modelService.fetchModelList(request).subscribe(data => {
              this.modelList = data;
              if (this.fromLease) {
                this.currentModel = this.lease.model_id;
              } else {
                this.currentModel = this.request.user_car_information.model_id;
              }
            });
          }
        })
      )
      .subscribe();
  }

  onNavButtonClick(data: INavigator) {
    if (data.click && data.type === 'next') {
      this.store$.dispatch(new UiActions.ClearNavigateState());
      this.goToNextStep();
    }
    if (data.click && data.type === 'previous') {
      this.store$.dispatch(new UiActions.ClearNavigateState());
      this.goToPreviousStep();
    }
  }

  goToNextStep() {
    this.store$.dispatch(
      new RequestActions.SetRequestData({
        data: {
          user_car_information: {
            own_a_car: this.currentLeaseMode,
            will_trade: this.currentTradeMode,
            year: this.currentYear,
            brand_id: this.currentBrand,
            model_id: this.currentModel,
            miles: this.miles,
            term_in_months: this.leaseTerm,
            lease_end_date: this.leaseEndDate,
          },
        },
      })
    );
    this.router$.navigate(['find-my-car/' + this.nextFindStep]);
  }

  goToPreviousStep() {
    this.router$.navigate(['find-my-car/' + this.prevFindStep]);
  }

  loadImage(evt) {
    this.loaded = true;
  }
}
