import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { IStore } from 'app/shared/interfaces/store.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

import { getBackgroundImage } from 'app/shared/states/colors/colors.selectors';

import {
  BUYING_METHOD_LIST,
  BUYING_TIME_LIST,
  FIND_STEP_BRAND,
  FIND_STEP_REVIEW,
  FIND_STEP_SEARCH_RESULT,
  FIND_STEP_SPEC,
} from 'app/core/constant';

import { Router } from '@angular/router';
import { NotificationService } from 'app/shared/services/notification.service';
import { IBrand } from 'app/shared/states/brands/brands.interfaces';
import { selectCurrentBrand } from 'app/shared/states/brands/brands.selectors';
import {
  IColorExterior,
  IColorInterior,
} from 'app/shared/states/colors/colors.interfaces';
import { IModel } from 'app/shared/states/models/models.interfaces';
import { selectCurrentModel } from 'app/shared/states/models/models.selectors';
import { IOption } from 'app/shared/states/options/options.interfaces';
import {
  getoptionsAsArray,
  getSelectedoptions,
} from 'app/shared/states/options/options.selectors';
import * as RequestActions from 'app/shared/states/request/request.actions';
import { IRequest } from 'app/shared/states/request/request.interface';
import { getState } from 'app/shared/states/request/request.selectors';
import { ITrim } from 'app/shared/states/trim/trim.interfaces';
import { selectCurrentTrim } from 'app/shared/states/trim/trim.selectors';
import * as UiActions from 'app/shared/states/ui/ui.actions';
import { INavigator } from 'app/shared/states/ui/ui.interface';
import { Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit, OnDestroy {
  @ViewChild('addPromoModal') addPromoModal;

  private pageTitle = 'Review Details';
  public firstFindStep = FIND_STEP_BRAND;
  public prevFindStep = FIND_STEP_SPEC;
  public currentFindStep = FIND_STEP_REVIEW;
  public nextFindStep = FIND_STEP_SEARCH_RESULT;

  // brand
  public selectedBrand$: Observable<IBrand>;
  public selectedBrand: IBrand;
  // model
  public selectedModel$: Observable<IModel>;
  public selectedModel: IModel;
  // trim
  public selectedTrim$: Observable<ITrim>;
  public selectedTrim: ITrim;
  // colors
  public interiorColors$: Observable<IColorInterior[]>;
  public exteriorColors$: Observable<IColorExterior[]>;
  public interiorSelectionStatus$: Observable<Array<boolean>>;
  public exteriorSelectionStatus$: Observable<Array<boolean>>;
  public backgroundImage$: Observable<string>;
  public interiorColors: Array<IColorInterior> = [];
  public exteriorColors: Array<IColorExterior> = [];
  public interiorSelectionStatus: Array<boolean> = [];
  public exteriorSelectionStatus: Array<boolean> = [];

  public navButtonClick$: Observable<INavigator>;
  public config = {
    displayKey: 'value',
    search: true,
  };

  // options
  public selectedOptions$: Observable<Array<number>>;
  public options$: Observable<Array<IOption>>;
  public selectionStatus: Array<boolean> = [];

  // request
  public request$: Observable<IRequest>;
  public request: IRequest;

  private onDestroy$ = new Subject<void>();
  private addPromoModalRef: BsModalRef;

  public timeDropdownOptions = [];
  public methodDropdownOptions = [];
  public promoCodeList = [];
  public newPromoCodeList = [];
  public buyingTimeModel;
  public buyingMethodModel;
  public promoCodeModel;

  public loaded = true;

  constructor(
    private store$: Store<IStore>,
    private modalService: BsModalService,
    private router$: Router,
    private notificationService$: NotificationService
  ) {}

  ngOnInit() {
    this.initSubHeader();
    this.timeDropdownOptions = BUYING_TIME_LIST ? BUYING_TIME_LIST : [];
    this.methodDropdownOptions = BUYING_METHOD_LIST ? BUYING_METHOD_LIST : [];
    // brand
    this.selectedBrand$ = this.store$.select(selectCurrentBrand);
    this.selectedBrand$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(brand => (this.selectedBrand = brand))
      )
      .subscribe();
    // model
    this.selectedModel$ = this.store$.select(selectCurrentModel);
    this.selectedModel$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(model => (this.selectedModel = model))
      )
      .subscribe();
    // trim
    this.selectedTrim$ = this.store$.select(selectCurrentTrim);
    this.selectedTrim$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(trim => (this.selectedTrim = trim))
      )
      .subscribe();
    // colors
    this.interiorColors$ = this.store$.select(state => state.color.interior);
    this.exteriorColors$ = this.store$.select(state => state.color.exterior);
    this.interiorSelectionStatus$ = this.store$.select(
      state => state.color.interior_selection_status
    );
    this.exteriorSelectionStatus$ = this.store$.select(
      state => state.color.exterior_selection_status
    );
    this.backgroundImage$ = this.store$.select(getBackgroundImage);
    this.interiorSelectionStatus$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(colors => (this.interiorSelectionStatus = colors))
      )
      .subscribe();
    this.exteriorSelectionStatus$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(colors => (this.exteriorSelectionStatus = colors))
      )
      .subscribe();

    // options
    this.options$ = this.store$.select(getoptionsAsArray);
    this.selectedOptions$ = this.store$.select(getSelectedoptions);
    this.options$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(options => {
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
          for (let i = 0; i < this.selectionStatus.length; i++) {
            if (options.find(option => option === i + 1)) {
              this.selectionStatus[i] = true;
            }
          }
        })
      )
      .subscribe();

    // request
    this.request$ = this.store$.select(getState);
    this.request$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(req => {
          if (req !== null) {
            this.request = req;
            this.buyingTimeModel = this.request.buying_time;
            this.buyingMethodModel = this.request.buying_method;
            this.promoCodeList = this.request.referral_code;
          }
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
  }

  onNavButtonClick(data: INavigator) {
    if (data.click && data.type === 'next') {
      if (
        typeof this.buyingMethodModel === 'undefined' ||
        this.buyingMethodModel === null
      ) {
        this.notificationService$.error('Please select buying method.');
        return;
      }
      if (
        typeof this.buyingTimeModel === 'undefined' ||
        this.buyingTimeModel === null
      ) {
        this.notificationService$.error('Please select buying time.');
        return;
      }
      this.store$.dispatch(new UiActions.ClearNavigateState());
      this.goToNextStep();
    }

    if (data.click && data.type === 'previous') {
      this.store$.dispatch(new UiActions.ClearNavigateState());
      this.gotToPreviousStep();
    }
  }

  goToNextStep() {
    this.store$.dispatch(
      new RequestActions.SetRequestData({
        data: {
          buying_time: this.buyingTimeModel,
          buying_method: this.buyingMethodModel,
          referral_code: this.promoCodeList,
        },
      })
    );
    this.router$.navigate(['find-my-car/' + this.nextFindStep]);
  }

  gotToPreviousStep() {
    this.router$.navigate(['find-my-car/' + this.prevFindStep]);
  }

  initSubHeader() {
    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.SetShowNextButton(true));
    this.store$.dispatch(new UiActions.SetShowPrevButton(true));
    this.store$.dispatch(new UiActions.SetShowStepper(false));
    this.store$.dispatch(new UiActions.SetCurrentPage(this.currentFindStep));
    this.store$.dispatch(new UiActions.SetNextPage(this.nextFindStep));
    this.store$.dispatch(new UiActions.SetPrevPage(this.prevFindStep));
  }
  selectionChanged(type: string, $event) {}

  onAddPromoButtonClick() {
    this.newPromoCodeList = this.promoCodeList.slice(0);
    this.addPromoModalRef = this.modalService.show(this.addPromoModal);
  }

  onDismissAddPromoModal() {
    this.addPromoModalRef.hide();
  }

  getPromoCodeText() {
    if (this.promoCodeList.length === 1) {
      return 'Promo Code: ' + this.promoCodeList[0] + ' Added';
    } else {
      return this.promoCodeList.length + ' Promo Codes Added';
    }
  }

  onPromoCodeAdd() {
    if (!this.promoCodeModel.trim().length) {
      this.notificationService$.error('Promo code is empty!');
      return;
    }
    if (this.newPromoCodeList.indexOf(this.promoCodeModel) === -1) {
      this.newPromoCodeList.push(this.promoCodeModel);
    } else {
      this.notificationService$.error('Promo code is already existing!');
    }
    this.promoCodeModel = '';
  }

  onPromoCodeDelete(i: number) {
    this.newPromoCodeList.splice(i - 1, 1);
  }

  onPromoCodeConfirm() {
    this.promoCodeList = this.newPromoCodeList.slice(0);
    this.newPromoCodeList = [];
    this.addPromoModalRef.hide();
  }

  loadImage(evt) {
    this.loaded = true;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
