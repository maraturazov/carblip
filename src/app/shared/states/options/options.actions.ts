import { Action } from '@ngrx/store';

import {
  IOption,
  IRequestFecthList,
} from 'app/shared/states/options/options.interfaces';

/**
 * create one class per action and do not forget to add them at the end to the type All
 * this way, you'll be able to have type checking when dispatching and also in your reducers
 */
export const FETCH_OPTION_LIST = '[OPTION]Fetch option details';
export class FetchOptionList implements Action {
  readonly type = FETCH_OPTION_LIST;

  constructor(public requestParam: IRequestFecthList) {}
}

export const FETCH_OPTION_LIST_SUCCESS = '[OPTION]Fetch option details success';
export class FetchOptionListSuccess implements Action {
  readonly type = FETCH_OPTION_LIST_SUCCESS;

  constructor(public payload: { data: IOption[] }) {}
}

export const FETCH_OPTION_LIST_FAILED = '[OPTION]Fetch option details failed';
export class FetchOptionListFailed implements Action {
  readonly type = FETCH_OPTION_LIST_FAILED;

  constructor(public payload: { error: string }) {}
}

export const SELECT_OPTION = '[OPTION]Select option item';
export class SelectOption implements Action {
  readonly type = SELECT_OPTION;

  constructor(public payload: { id: number; checked: boolean }) {}
}

export const CLEAR_OPTION_LIST = '[option]Clear option list';
export class ClearOptionList implements Action {
  readonly type = CLEAR_OPTION_LIST;

  constructor() {}
}

export type All =
  | SelectOption
  | FetchOptionListFailed
  | FetchOptionListSuccess
  | FetchOptionList
  | ClearOptionList;
