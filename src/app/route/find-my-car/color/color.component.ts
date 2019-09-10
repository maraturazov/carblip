import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IStore } from 'app/shared/interfaces/store.interface';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import {
  FIND_STEP_BRAND,
  FIND_STEP_COLOR,
  FIND_STEP_SPEC,
  FIND_STEP_TRIM,
} from 'app/core/constant';
import * as ColorActions from 'app/shared/states/colors/colors.actions';
import { IRequestFecthList } from 'app/shared/states/colors/colors.interfaces';
import {
  IColorExterior,
  IColorInterior,
} from 'app/shared/states/colors/colors.interfaces';
import { ITrim } from 'app/shared/states/trim/trim.interfaces';
import { selectCurrentTrim } from 'app/shared/states/trim/trim.selectors';
import * as UiActions from 'app/shared/states/ui/ui.actions';
import { INavigator } from 'app/shared/states/ui/ui.interface';

import { ImageLoadService } from 'app/shared/services/image-load.service';
import { NotificationService } from 'app/shared/services/notification.service';
import {
  getBackgroundImage,
  getExteriorColorList,
  getExteriorSelectionList,
  getInteriorColorList,
  getInteriorSelectionList,
  getSelectedExteriorColorList,
  getSelectedInteriorColorList,
} from 'app/shared/states/colors/colors.selectors';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
})
export class ColorComponent implements OnInit, OnDestroy {
  private pageTitle = 'Preferred Colors';
  public firstFindStep = FIND_STEP_BRAND;
  public currentFindStep = FIND_STEP_COLOR;
  public nextFindStep = FIND_STEP_SPEC;
  public prevFindStep = FIND_STEP_TRIM;

  private onDestroy$ = new Subject<void>();
  public interiorColors$: Observable<IColorInterior[]>;
  public exteriorColors$: Observable<IColorExterior[]>;
  public selectedInteriorColors$: Observable<Array<number>>;
  public selectedExteriorColors$: Observable<Array<number>>;
  public interiorSelectionStatus$: Observable<Array<boolean>>;
  public exteriorSelectionStatus$: Observable<Array<boolean>>;
  public selectedTrim$: Observable<ITrim>;
  public fetching$: Observable<boolean>;
  public didFetch$: Observable<boolean>;
  public backgroundImage$: Observable<string>;
  public navButtonClick$: Observable<INavigator>;

  public selectedInteriorColors: Array<number>;
  public selectedExteriorColors: Array<number>;

  public interiorSelectionStatus: Array<boolean>;
  public exteriorSelectionStatus: Array<boolean>;

  public backgroundImage: string;
  public isEventPrevented = false;
  public imageLoaded = false;

  constructor(
    private store$: Store<IStore>,
    private router$: Router,
    private notificationService$: NotificationService,
    private imageLoadService$: ImageLoadService
  ) {}

  ngOnInit() {
    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetShowNextButton(true));
    this.store$.dispatch(new UiActions.SetCurrentPage(this.currentFindStep));
    this.store$.dispatch(new UiActions.SetNextPage(this.nextFindStep));
    this.store$.dispatch(new UiActions.SetPrevPage(this.prevFindStep));
    this.store$.dispatch(new UiActions.SetShowStepper(true));

    this.fetching$ = this.store$.pipe(select(state => state.color.fetching));
    this.didFetch$ = this.store$.pipe(select(state => state.color.didFetch));
    this.interiorColors$ = this.store$.select(getInteriorColorList);
    this.exteriorColors$ = this.store$.select(getExteriorColorList);

    this.selectedInteriorColors$ = this.store$.select(
      getSelectedInteriorColorList
    );
    this.selectedExteriorColors$ = this.store$.select(
      getSelectedExteriorColorList
    );

    this.interiorSelectionStatus$ = this.store$.select(
      getInteriorSelectionList
    );

    this.exteriorSelectionStatus$ = this.store$.select(
      getExteriorSelectionList
    );

    this.backgroundImage$ = this.store$.select(getBackgroundImage);

    this.backgroundImage$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(backgroundImage => {
          this.imageLoaded = false;
          this.backgroundImage = backgroundImage;
          this.imageLoadService$.loadImage(backgroundImage).subscribe(() => {
            this.imageLoaded = true;
          });
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

    this.selectedTrim$ = this.store$.select(selectCurrentTrim);
    this.selectedTrim$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(trim => {
          this.loadColors(trim);
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
  }

  onNavButtonClick(data: INavigator) {
    if (data.click && data.type === 'next') {
      this.store$.dispatch(new UiActions.ClearNavigateState());
      if (!this.selectedExteriorColors.length) {
        this.notificationService$.error(
          'Please select at least one exterior color!'
        );
      } else {
        this.goToNextStep();
      }
    }
  }

  loadColors(trim) {
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
            this.store$.dispatch(new ColorActions.FetchColorList(request))
        )
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSelectColor(type: string, id: number, index: number) {
    const request = { type: type, data: id, selection: false, index: index };
    switch (type) {
      case 'exterior':
        request.selection = this.exteriorSelectionStatus[index];
        break;
      case 'interior':
        request.selection = this.interiorSelectionStatus[index];
        break;
      default:
        break;
    }
    this.store$.dispatch(new ColorActions.SelectColor(request));
  }

  goToNextStep() {
    this.store$.dispatch(new UiActions.ClearNavigateState());
    this.store$.dispatch(new UiActions.SetLastStep(this.currentFindStep));
    this.router$.navigate(['find-my-car/' + this.nextFindStep]);
  }

  goToFirstStep() {
    this.router$.navigate(['find-my-car/' + this.firstFindStep]);
  }
}
