import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { FIND_STEP_BRAND, FIND_STEP_MODEL } from 'app/core/constant';

import { IStore } from 'app/shared/interfaces/store.interface';
import { ImageLoadService } from 'app/shared/services/image-load.service';
import * as BrandActions from 'app/shared/states/brands/brands.actions';
import { IBrand } from 'app/shared/states/brands/brands.interfaces';
import {
  getBrandsAsArray,
  selectCurrentBrandId,
} from 'app/shared/states/brands/brands.selectors';
import * as ColorActions from 'app/shared/states/colors/colors.actions';
import * as ModelActions from 'app/shared/states/models/models.actions';
import * as OptionActions from 'app/shared/states/options/options.actions';
import * as TrimActions from 'app/shared/states/trim/trim.actions';
import * as UiActions from 'app/shared/states/ui/ui.actions';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit, OnDestroy {
  public pageTitle = 'Shop By Brand';
  public nextFindStep = FIND_STEP_MODEL;
  public currentFindStep = FIND_STEP_BRAND;
  private onDestroy$ = new Subject<void>();
  public brands$: Observable<IBrand[]>;
  public selectedBrandId$: Observable<number>;
  public fetching$: Observable<boolean>;
  public didFetch$: Observable<boolean>;
  public searchString$: Observable<string>;

  public selectedBrandId: number;
  public searchString = null;
  public brands: IBrand[] = [];
  public filteredBrands: IBrand[] = [];
  public imageLoaded = false;
  constructor(
    private store$: Store<IStore>,
    private router$: Router,
    private imageLoadService$: ImageLoadService
  ) {}

  ngOnInit() {
    this.fetching$ = this.store$.pipe(select(state => state.brand.fetching));
    this.didFetch$ = this.store$.pipe(select(state => state.brand.didFetch));
    this.brands$ = this.store$.select(getBrandsAsArray);
    this.selectedBrandId$ = this.store$.select(selectCurrentBrandId);
    this.searchString$ = this.store$.pipe(
      select(state => state.ui.searchString)
    );

    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetShowStepper(false));
    this.store$.dispatch(new UiActions.SetShowSearchBox(true));
    this.store$.dispatch(new UiActions.SetCurrentPage(this.currentFindStep));

    this.selectedBrandId$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(brandId => (this.selectedBrandId = brandId))
      )
      .subscribe();

    this.didFetch$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(
          didFetch =>
            !didFetch && this.store$.dispatch(new BrandActions.FetchBrandList())
        )
      )
      .subscribe();

    this.brands$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(brands => {
          brands.sort((a, b) => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
          });
          this.brands = this.filteredBrands = brands;
          const imageUrls = this.brands.map(function(a) {
            return a.image_url;
          });
          this.imageLoadService$.loadImages(imageUrls).subscribe(() => {
            this.imageLoaded = true;
          });
        })
      )
      .subscribe();

    this.searchString$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(searchString => {
          if (searchString) {
            this.filteredBrands = this.brands.filter(
              brand =>
                brand.name.toLowerCase().indexOf(searchString.toLowerCase()) >=
                0
            );
          } else {
            this.filteredBrands = this.brands;
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSelectBrand(id: number) {
    if (this.selectedBrandId !== id) {
      this.store$.dispatch(new ModelActions.ClearModelList());
      this.store$.dispatch(new TrimActions.ClearTrimList());
      this.store$.dispatch(new ColorActions.ClearColorList());
      this.store$.dispatch(new OptionActions.ClearOptionList());
      this.store$.dispatch(new BrandActions.SelectBrand(id));
    }
    this.store$.dispatch(new UiActions.SetLastStep(this.currentFindStep));
    this.router$.navigate(['find-my-car/' + this.nextFindStep]);
  }
}
