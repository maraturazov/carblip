import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as ColorActions from 'app/shared/states/colors/colors.actions';
import { ColorServiceImpl } from 'app/shared/states/colors/colors.service';
import { environment } from 'environments/environment';

@Injectable()
export class ColorEffects {
  constructor(
    // if needed, you can inject the store to get some part of
    // it with a `withLatestFrom` for example
    // private store$: Store<IStore>,
    private actions$: Actions,
    private colorService: ColorServiceImpl
  ) {}

  // tslint:disable-next-line:member-ordering
  @Effect({ dispatch: true })
  fetchColorList$: Observable<Action> = this.actions$.pipe(
    ofType<ColorActions.FetchColorList>(ColorActions.FETCH_COLOR_LIST),
    switchMap(action =>
      this.colorService.fetchColorList(action.requestParam).pipe(
        map(color => new ColorActions.FetchColorListSuccess({ data: color })),
        catchError(err => {
          if (environment.debug) {
            console.group();
            console.warn('Error caught in color.effects:');
            console.error(err);
            console.groupEnd();
          }

          return of(
            new ColorActions.FetchColorListFailed({
              error: err,
            })
          );
        })
      )
    )
  );
}
