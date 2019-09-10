import { Action } from '@ngrx/store';

import {
  IColors,
  IRequestFecthList,
} from 'app/shared/states/colors/colors.interfaces';

/**
 * create one class per action and do not forget to add them at the end to the type All
 * this way, you'll be able to have type checking when dispatching and also in your reducers
 */
export const FETCH_COLOR_LIST = '[Color]Fetch color details';
export class FetchColorList implements Action {
  readonly type = FETCH_COLOR_LIST;

  constructor(public requestParam: IRequestFecthList) {}
}

export const FETCH_COLOR_LIST_SUCCESS = '[Color]Fetch color details success';
export class FetchColorListSuccess implements Action {
  readonly type = FETCH_COLOR_LIST_SUCCESS;

  constructor(public payload: { data: IColors }) {}
}

export const FETCH_COLOR_LIST_FAILED = '[Color]Fetch color details failed';
export class FetchColorListFailed implements Action {
  readonly type = FETCH_COLOR_LIST_FAILED;

  constructor(public payload: { error: string }) {}
}

export const SELECT_COLOR = '[Color]Select color item';
export class SelectColor implements Action {
  readonly type = SELECT_COLOR;

  constructor(
    public payload: {
      type: string;
      data: number;
      selection: boolean;
      index: number;
    }
  ) {}
}

export const CLEAR_COLOR_LIST = '[Color]Clear color list';
export class ClearColorList implements Action {
  readonly type = CLEAR_COLOR_LIST;

  constructor() {}
}

// list every action class here
export type All =
  | FetchColorList
  | FetchColorListSuccess
  | FetchColorListFailed
  | SelectColor
  | ClearColorList;
