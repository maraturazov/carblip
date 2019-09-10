import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as optionActions from 'app/shared/states/options/options.actions';
import { OptionServiceImpl } from 'app/shared/states/options/options.service';
import { environment } from 'environments/environment';

@Injectable()
export class OptionEffects {
  constructor(
    // if needed, you can inject the store to get some part of
    // it with a `withLatestFrom` for example
    // private store$: Store<IStore>,
    private actions$: Actions,
    private OptionService: OptionServiceImpl
  ) {}

  // tslint:disable-next-line:member-ordering
  @Effect({ dispatch: true })
  FetchOptionList$: Observable<Action> = this.actions$.pipe(
    ofType<optionActions.FetchOptionList>(optionActions.FETCH_OPTION_LIST),
    switchMap(action =>
      this.OptionService.FetchOptionList(action.requestParam).pipe(
        map(
          options =>
            new optionActions.FetchOptionListSuccess({
              data: options,
            })
        ),
        catchError(err => {
          if (environment.debug) {
            console.group();
            console.warn('Error caught in options.effects:');
            console.error(err);
            console.groupEnd();
          }

          return of(
            new optionActions.FetchOptionListFailed({
              error: err,
            })
          );
        })
      )
    )
  );
}
