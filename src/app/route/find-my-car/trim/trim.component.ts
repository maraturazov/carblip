import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IStore } from 'app/shared/interfaces/store.interface';
import { IRequestFecthList } from 'app/shared/states/trim/trim.interfaces';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import {
  FIND_STEP_BRAND,
  FIND_STEP_COLOR,
  FIND_STEP_MODEL,
  FIND_STEP_TRIM,
} from 'app/core/constant';
import * as ColorActions from 'app/shared/states/colors/colors.actions';
import { IModel } from 'app/shared/states/models/models.interfaces';
import { selectCurrentModel } from 'app/shared/states/models/models.selectors';
import * as OptionActions from 'app/shared/states/options/options.actions';
import * as TrimActions from 'app/shared/states/trim/trim.actions';
import { ITrim } from 'app/shared/states/trim/trim.interfaces';
import * as UiActions from 'app/shared/states/ui/ui.actions';

import { ImageLoadService } from 'app/shared/services/image-load.service';
import { NotificationService } from 'app/shared/services/notification.service';
import {
  getTrimAsArray,
  selectCurrentTrimId,
} from 'app/shared/states/trim/trim.selectors';
import { INavigator } from 'app/shared/states/ui/ui.interface';

@Component({
  selector: 'app-trim',
  templateUrl: './trim.component.html',
  styleUrls: ['./trim.component.scss'],
})
export class TrimComponent implements OnInit, OnDestroy {
  private pageTitle = 'Shop By ';
  public firstFindStep = FIND_STEP_BRAND;
  public nextFindStep = FIND_STEP_COLOR;
  public currentFindStep = FIND_STEP_TRIM;
  public prevFindStep = FIND_STEP_MODEL;

  private onDestroy$ = new Subject<void>();
  public trims$: Observable<ITrim[]>;
  public selectedModel$: Observable<IModel>;
  public selectedTrimId$: Observable<number>;
  public navButtonClick$: Observable<INavigator>;
  public fetching$: Observable<boolean>;
  public didFetch$: Observable<boolean>;

  public trims: ITrim[] = [];
  public imageLoaded = false;
  public selectedTrimId: number;
  public msgShown = false;
  constructor(
    private store$: Store<IStore>,
    private router$: Router,
    private notificationService$: NotificationService,
    private imageLoadService$: ImageLoadService
  ) {}

  ngOnInit() {
    this.fetching$ = this.store$.pipe(select(state => state.trim.fetching));
    this.didFetch$ = this.store$.pipe(select(state => state.trim.didFetch));
    this.navButtonClick$ = this.store$.pipe(
      select(state => state.ui.navigateButtonClick)
    );
    this.trims$ = this.store$.select(getTrimAsArray);
    this.selectedModel$ = this.store$.select(selectCurrentModel);
    this.selectedTrimId$ = this.store$.select(selectCurrentTrimId);
    this.store$.dispatch(new UiActions.SetCurrentPage(this.currentFindStep));
    this.store$.dispatch(new UiActions.SetPrevPage(this.prevFindStep));
    this.store$.dispatch(new UiActions.SetShowNextButton(false));

    this.selectedTrimId$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(modelId => (this.selectedTrimId = modelId))
      )
      .subscribe();

    this.selectedModel$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(model => {
          if (!model) {
            this.goToFirstStep();
          } else {
            this.store$.dispatch(
              new UiActions.SetSubHeaderTitle(this.pageTitle + model.name)
            );
            this.loadTrims(model);
          }
        })
      )
      .subscribe();

    this.trims$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(trims => {
          trims.sort((a, b) => {
            return a.trim.toLowerCase() > b.trim.toLowerCase() ? 1 : -1;
          });
          this.trims = trims;
          const imageUrls = this.trims.map(function(a) {
            return a.image_url;
          });
          this.imageLoadService$.loadImages(imageUrls).subscribe(() => {
            this.imageLoaded = true;
          });
        })
      )
      .subscribe();

    this.didFetch$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(data => {
          if (data && this.trims.length === 0 && !this.msgShown) {
            this.notificationService$.warning('No matching products found');
            this.store$.dispatch(new UiActions.SetShowPrevButton(true));
            this.msgShown = true;
          }
        })
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
  }

  onNavButtonClick(data: INavigator) {
    if (data.click && data.type === 'previous') {
      this.store$.dispatch(new UiActions.ClearNavigateState());
      this.router$.navigate(['/find-my-car/' + this.prevFindStep]);
    }
  }

  loadTrims(model) {
    const request: IRequestFecthList = {
      max_price: model.max_price,
      min_price: model.min_price,
      zip: '',
      models: [model.id],
    };

    this.didFetch$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(
          didFetch =>
            !didFetch &&
            this.store$.dispatch(new TrimActions.FetchTrimList(request))
        )
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSelectTrim(id: number) {
    if (this.selectedTrimId !== id) {
      this.store$.dispatch(new ColorActions.ClearColorList());
      this.store$.dispatch(new OptionActions.ClearOptionList());
      this.store$.dispatch(new TrimActions.SelectTrim(id));
    }
    this.store$.dispatch(new UiActions.ClearNavigateState());
    this.store$.dispatch(new UiActions.SetLastStep(this.currentFindStep));
    this.router$.navigate(['find-my-car/' + this.nextFindStep]);
  }

  goToFirstStep() {
    this.router$.navigate(['find-my-car/' + this.firstFindStep]);
  }
}
