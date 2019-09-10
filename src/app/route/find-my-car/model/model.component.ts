import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import {
  FIND_STEP_BRAND,
  FIND_STEP_MODEL,
  FIND_STEP_TRIM,
} from 'app/core/constant';
import { IStore } from 'app/shared/interfaces/store.interface';
import { ImageLoadService } from 'app/shared/services/image-load.service';
import { IBrand } from 'app/shared/states/brands/brands.interfaces';
import { selectCurrentBrand } from 'app/shared/states/brands/brands.selectors';
import * as ColorActions from 'app/shared/states/colors/colors.actions';
import * as ModelActions from 'app/shared/states/models/models.actions';
import { IModel } from 'app/shared/states/models/models.interfaces';
import { IRequestFecthList } from 'app/shared/states/models/models.interfaces';
import {
  getModelsAsArray,
  selectCurrentModelId,
} from 'app/shared/states/models/models.selectors';
import * as OptionActions from 'app/shared/states/options/options.actions';
import * as TrimActions from 'app/shared/states/trim/trim.actions';
import * as UiActions from 'app/shared/states/ui/ui.actions';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements OnInit, OnDestroy {
  private pageTitle = 'Shop By ';
  public firstFindStep = FIND_STEP_BRAND;
  public nextFindStep = FIND_STEP_TRIM;
  public currentFindStep = FIND_STEP_MODEL;

  private onDestroy$ = new Subject<void>();
  public selectedBrand$: Observable<IBrand>;
  public models$: Observable<IModel[]>;
  public selectedModelId$: Observable<number>;
  public fetching$: Observable<boolean>;
  public didFetch$: Observable<boolean>;

  public models: IModel[] = [];
  public selectedModelId: number;
  public imageLoaded = false;
  constructor(
    private store$: Store<IStore>,
    private router$: Router,
    private imageLoadService$: ImageLoadService
  ) {}

  ngOnInit() {
    this.fetching$ = this.store$.pipe(select(state => state.model.fetching));
    this.didFetch$ = this.store$.pipe(select(state => state.model.didFetch));
    this.selectedBrand$ = this.store$.select(selectCurrentBrand);
    this.models$ = this.store$.select(getModelsAsArray);
    this.selectedModelId$ = this.store$.select(selectCurrentModelId);

    this.selectedModelId$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(modelId => (this.selectedModelId = modelId))
      )
      .subscribe();

    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetShowStepper(true));
    this.store$.dispatch(new UiActions.SetCurrentPage(this.currentFindStep));

    this.selectedBrand$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(brand => {
          if (!brand) {
            this.goToFirstStep();
          } else {
            this.store$.dispatch(
              new UiActions.SetSubHeaderTitle(this.pageTitle + brand.name)
            );
            this.loadModels(brand);
          }
        })
      )
      .subscribe();

    this.models$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(models => {
          models.sort((a, b) => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
          });
          this.models = models;
          const imageUrls = this.models.map(function(a) {
            return a.image_url;
          });
          this.imageLoadService$.loadImages(imageUrls).subscribe(() => {
            this.imageLoaded = true;
          });
        })
      )
      .subscribe();
  }

  loadModels(brand) {
    const request: IRequestFecthList = {
      brand_id: brand.id,
      min_price: brand.min_price,
      max_price: brand.max_price,
    };

    this.didFetch$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(
          didFetch =>
            !didFetch &&
            this.store$.dispatch(new ModelActions.FetchModelList(request))
        )
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSelectModel(id: number) {
    if (this.selectedModelId !== id) {
      this.store$.dispatch(new TrimActions.ClearTrimList());
      this.store$.dispatch(new ColorActions.ClearColorList());
      this.store$.dispatch(new OptionActions.ClearOptionList());
      this.store$.dispatch(new ModelActions.SelectModel(id));
    }
    this.store$.dispatch(new UiActions.SetLastStep(this.currentFindStep));
    this.router$.navigate(['find-my-car/' + this.nextFindStep]);
  }

  goToFirstStep() {
    this.router$.navigate(['find-my-car/' + this.firstFindStep]);
  }
}
