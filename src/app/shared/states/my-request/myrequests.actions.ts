import { Action } from '@ngrx/store';

import { IRequest } from 'app/shared/states/my-request/myrequests.interfaces';

export const FETCH_REQUEST_LIST = '[REQUEST]Fetch request details';
export class FetchRequestList implements Action {
  readonly type = FETCH_REQUEST_LIST;

  constructor(public payload: { user_id: string }) {}
}

export const FETCH_REQUEST_LIST_SUCCESS =
  '[REQUEST]Fetch request details success';
export class FetchRequestListSuccess implements Action {
  readonly type = FETCH_REQUEST_LIST_SUCCESS;

  constructor(public payload: { data: IRequest[] }) {}
}

export const FETCH_REQUEST_LIST_FAILED =
  '[REQUEST]Fetch request details failed';
export class FetchRequestListFailed implements Action {
  readonly type = FETCH_REQUEST_LIST_FAILED;

  constructor(public payload: { error: string }) {}
}

export const CLEAR_REQUEST_LIST = '[REQUEST]Clear request details';
export class ClearRequestList implements Action {
  readonly type = CLEAR_REQUEST_LIST;

  constructor() {}
}
// list every action class here
export type All =
  | FetchRequestList
  | FetchRequestListSuccess
  | FetchRequestListFailed
  | ClearRequestList;
