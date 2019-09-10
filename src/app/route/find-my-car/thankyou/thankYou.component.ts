import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IStore } from 'app/shared/interfaces/store.interface';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import {
  CREDIT_ASSESSMENT_LIST,
  FIND_STEP_BRAND,
  FIND_STEP_CREDIT,
  FIND_STEP_THANKS,
  OWN_CAR,
  WILL_TRADE,
} from 'app/core/constant';

import * as UiActions from 'app/shared/states/ui/ui.actions';

import { IProfile } from 'app/shared/states/auth/auth.interfaces';
import { IBrand } from 'app/shared/states/brands/brands.interfaces';
import {
  IColorExterior,
  IColorInterior,
} from 'app/shared/states/colors/colors.interfaces';
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
  getBackgroundImage,
  selectCurrentExteriorColors,
  selectCurrentInteriorColors,
} from 'app/shared/states/colors/colors.selectors';
import { selectCurrentModel } from 'app/shared/states/models/models.selectors';
import { getState } from 'app/shared/states/request/request.selectors';
import { selectCurrentTrim } from 'app/shared/states/trim/trim.selectors';

import * as BrandsActions from 'app/shared/states/brands/brands.actions';
import { BrandsServiceImpl } from 'app/shared/states/brands/brands.service';
import * as ColorsActions from 'app/shared/states/colors/colors.actions';
import * as ModelsActions from 'app/shared/states/models/models.actions';
import { ModelsServiceImpl } from 'app/shared/states/models/models.service';
import * as OptionsActions from 'app/shared/states/options/options.actions';
import * as TrimActions from 'app/shared/states/trim/trim.actions';
@Component({
  selector: 'app-thankyou',
  templateUrl: './thankYou.component.html',
  styleUrls: ['./thankYou.component.scss'],
})
export class ThankYouComponent implements OnInit, OnDestroy {
  private pageTitle = 'Thank you';
  public firstFindStep = FIND_STEP_BRAND;
  public prevFindStep = FIND_STEP_CREDIT;
  public currentFindStep = FIND_STEP_THANKS;

  public userName = 'User Name';
  public ownCar = OWN_CAR;
  public willTrade = WILL_TRADE;
  public creditInfo = CREDIT_ASSESSMENT_LIST;
  public brandName = 'Brand';
  public modelName = 'Model';

  private onDestroy$ = new Subject<void>();

  public userData$: Observable<IProfile>;
  public backgroundImage$: Observable<string>;
  public selectedBrand$: Observable<IBrand>;
  public selectedModel$: Observable<IModel>;
  public selectedTrim$: Observable<ITrim>;
  public request$: Observable<IRequest>;
  public selectedExteriorColors$: Observable<IColorExterior[]>;
  public selectedInteriorColors$: Observable<IColorInterior[]>;

  public navButtonClick$: Observable<INavigator>;

  public selectedBrandName: string;
  public selectedModelInfo: any;
  public selectedTrim: any;
  public request: IRequest;
  public selectedExteriorColors: IColorExterior[];
  public selectedInteriorColors: IColorInterior[];

  public brands$: Observable<IBrand[]>;
  public loaded = false;

  constructor(
    private store$: Store<IStore>,
    private router$: Router,
    public brandsService$: BrandsServiceImpl,
    public modelsService$: ModelsServiceImpl
  ) {}

  ngOnInit() {
    this.initSubHeader();

    this.userData$ = this.store$.pipe(select(getUserData));
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
    this.brands$ = this.store$.select(getBrandsAsArray);

    this.getData();
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

    this.request$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(req => {
          this.request = req;
          this.getBrandandModel();
        })
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
        tap(
          trim =>
            (this.selectedTrim = trim
              ? { name: trim.trim, year: trim.year }
              : null)
        )
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
      this.store$.dispatch(new UiActions.ClearNavigateState());
      this.store$.dispatch(new BrandsActions.ClearBrandList());
      this.store$.dispatch(new ModelsActions.ClearModelList());
      this.store$.dispatch(new TrimActions.ClearTrimList());
      this.store$.dispatch(new ColorsActions.ClearColorList());
      this.store$.dispatch(new OptionsActions.ClearOptionList());
      this.goToNextStep();
    }
    if (data.click && data.type === 'previous') {
      this.store$.dispatch(new UiActions.ClearNavigateState());
      this.goToPrevStep();
    }
  }

  goToNextStep() {
    this.router$.navigate(['find-my-car/' + this.firstFindStep]);
  }

  goToPrevStep() {
    this.router$.navigate(['find-my-car/' + this.prevFindStep]);
  }

  initSubHeader() {
    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.SetShowNextButton(true));
    this.store$.dispatch(new UiActions.SetShowNextLabel('Add a New Car'));
    this.store$.dispatch(new UiActions.SetCurrentPage(this.currentFindStep));
    this.store$.dispatch(new UiActions.SetNextPage(this.firstFindStep));
    this.store$.dispatch(new UiActions.SetPrevPage(this.prevFindStep));
  }

  getBrandandModel() {
    this.brandsService$.fetchBrandList().subscribe(brands => {
      const selectedBrands = brands.filter(
        brand => brand.id === this.request.user_car_information.brand_id
      );
      if (selectedBrands.length) {
        const selectedBrand = selectedBrands[0];
        this.brandName = selectedBrand.name;

        const request: IRequestFecthList = {
          brand_id: selectedBrand.id,
          min_price: selectedBrand.min_price,
          max_price: selectedBrand.max_price,
        };

        this.modelsService$.fetchModelList(request).subscribe(models => {
          const selectedModels = models.filter(
            model =>
              model.id === this.request.user_car_information.model_id.toString()
          );
          if (selectedModels.length) {
            this.modelName = selectedModels[0].name;
          }
        });
      }
    });
  }

  formatUSNumber(number) {
    const n = number.toString();
    return String(n).replace(/(.)(?=(\d{3})+$)/g, '$1,');
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  goToFirstStep() {
    this.router$.navigate(['find-my-car/' + this.firstFindStep]);
  }

  loadImage(evt) {
    this.loaded = true;
  }
}
