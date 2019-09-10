import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { DEFAULT_IMAGE_FUEL_ID } from 'app/core/constant';
import { IStore } from 'app/shared/interfaces/store.interface';
import { AuthServiceImpl } from 'app/shared/states/auth/auth.service';
import * as RequestsAcions from 'app/shared/states/my-request/myrequests.actions';
import { IRequest } from 'app/shared/states/my-request/myrequests.interfaces';
import { getRequestsAsArray } from 'app/shared/states/my-request/myrequests.selectors';
import * as UiActions from 'app/shared/states/ui/ui.actions';

@Component({
  selector: 'app-my-request',
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.scss'],
})
export class MyRequestComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  public request$: Observable<IRequest[]>;
  public didFetch$: Observable<boolean>;
  private pageTitle = 'My Requests';
  public request: any = [];
  constructor(
    private store$: Store<IStore>,
    private authServcie: AuthServiceImpl
  ) {}

  ngOnInit() {
    this.initSubHeader();

    this.didFetch$ = this.store$.pipe(select(state => state.requests.didFetch));
    this.request$ = this.store$.select(getRequestsAsArray);

    this.store$.dispatch(
      new RequestsAcions.FetchRequestList({
        user_id: this.authServcie.getUserID().toString(),
      })
    );

    this.request$
      .pipe(
        takeUntil(this.onDestroy$),
        tap(request => {
          this.request = request ? request : [];
          this.request.sort((a, b) => {
            return a.request_made_at > b.request_made_at ? -1 : 1;
          });
        })
      )
      .subscribe();
  }

  initSubHeader() {
    this.store$.dispatch(new UiActions.SetSubHeaderTitle(this.pageTitle));
    this.store$.dispatch(new UiActions.HideAllComponent());
    this.store$.dispatch(new UiActions.SetShowNextButton(false));
    this.store$.dispatch(new UiActions.SetShowStepper(false));
    this.store$.dispatch(new UiActions.SetShowStepper(false));
  }

  getColors(colors, type) {
    if (!colors) {
      return [];
    }
    return colors.filter(color => color.color_type === type);
  }

  getImage(id) {
    const exteriorColors = this.getColors(
      this.request[id].VehicleRequestColors,
      'External'
    );
    if (exteriorColors.length === 0) {
      return this.request[id].VehicleInventory.Vehicle.image_url;
    }
    return exteriorColors[
      exteriorColors.length - 1
    ].VehicleColor.VehicleColorsMedia.find(
      color => color.fuel_format_id === DEFAULT_IMAGE_FUEL_ID
    ).image_url;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  formatNumber(number) {
    let formattedNumber = '';
    for (let i = 0; i <= number.length - 1; i++) {
      formattedNumber += number[i];
      if (number.length - i > 5 && (number.length - i - 1) % 3 === 0) {
        formattedNumber += ',';
      }
    }
    return formattedNumber;
  }
}
