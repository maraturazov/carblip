import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as RequestsActions from 'app/shared/states/my-request/myrequests.actions';
import { RequestsServiceImpl } from 'app/shared/states/my-request/myrequests.service';

@Injectable()
export class RequestsEffects {
  constructor(
    private actions$: Actions,
    private requestsService: RequestsServiceImpl
  ) {}

  // tslint:disable-next-line:member-ordering
  @Effect({ dispatch: true })
  fetchRequestList$: Observable<Action> = this.actions$.pipe(
    ofType<RequestsActions.FetchRequestList>(
      RequestsActions.FETCH_REQUEST_LIST
    ),
    switchMap(action =>
      this.requestsService.fetchRequestList(action.payload).pipe(
        map(
          requests =>
            new RequestsActions.FetchRequestListSuccess({ data: requests })
        ),
        catchError(err => {
          return of(new RequestsActions.FetchRequestListFailed({ error: err }));
        })
      )
    )
  );
}
