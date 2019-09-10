import { Action } from '@ngrx/store';

import { INavigator } from './ui.interface';

export const SET_LANGUAGE = '[UI]Set language';
export class SetLanguage implements Action {
  readonly type = SET_LANGUAGE;

  constructor(public payload: { language: string }) {}
}

export const SET_SUBHEADER_TITLE = '[UI]Set Sub Header Title';
export class SetSubHeaderTitle implements Action {
  readonly type = SET_SUBHEADER_TITLE;

  constructor(public title: string) {}
}

export const SET_LAST_STEP = '[UI]Set Last Step';
export class SetLastStep implements Action {
  readonly type = SET_LAST_STEP;

  constructor(public page: string) {}
}

export const SET_SHOW_PREV_BUTTON = '[UI]Set Show Prev Button';
export class SetShowPrevButton implements Action {
  readonly type = SET_SHOW_PREV_BUTTON;

  constructor(public value: boolean) {}
}

export const SET_SHOW_NEXT_BUTTON = '[UI]Set Show Next Button';
export class SetShowNextButton implements Action {
  readonly type = SET_SHOW_NEXT_BUTTON;

  constructor(public value: boolean) {}
}

export const SET_CURRENT_PAGE = '[UI]Set Current Page';
export class SetCurrentPage implements Action {
  readonly type = SET_CURRENT_PAGE;

  constructor(public page: string) {}
}

export const SET_NEXT_PAGE = '[UI]Set Next Page';
export class SetNextPage implements Action {
  readonly type = SET_NEXT_PAGE;

  constructor(public page: string) {}
}

export const SET_PREV_PAGE = '[UI]Set Prev Page';
export class SetPrevPage implements Action {
  readonly type = SET_PREV_PAGE;

  constructor(public page: string) {}
}

export const NAVIGATE_BUTTON_CLICK = '[UI]Click Navigation Button';
export class NavigateButtonClick implements Action {
  readonly type = NAVIGATE_BUTTON_CLICK;

  constructor(public payload: INavigator) {}
}

export const CLEAR_NAVIGATE_STATE = '[UI]Clear Navigation State';
export class ClearNavigateState implements Action {
  readonly type = CLEAR_NAVIGATE_STATE;

  constructor() {}
}

export const SET_SHOW_STEPPER = '[UI]Set Show Stepper';
export class SetShowStepper implements Action {
  readonly type = SET_SHOW_STEPPER;

  constructor(public value: boolean) {}
}

export const SET_SHOW_SEARCH_BOX = '[UI]Set Show Search Box';
export class SetShowSearchBox implements Action {
  readonly type = SET_SHOW_SEARCH_BOX;

  constructor(public value: boolean) {}
}

export const SET_SEARCH_STRING = '[UI]Set Search String';
export class SetSearchString implements Action {
  readonly type = SET_SEARCH_STRING;

  constructor(public value: string) {}
}

export const SET_SHOW_CANCEL_SEARCH = '[UI]Set Show Cancel Search';
export class SetShowCancelSearch implements Action {
  readonly type = SET_SHOW_CANCEL_SEARCH;

  constructor(public value: boolean) {}
}

export const HIDE_ALL_COMPONENT = '[UI]Hide all component';
export class HideAllComponent implements Action {
  readonly type = HIDE_ALL_COMPONENT;

  constructor() {}
}

export const CLEAR_UI_INFO = '[UI]Clear ui info';
export class ClearUiInfo implements Action {
  readonly type = CLEAR_UI_INFO;

  constructor() {}
}

export const SET_SHOW_NEXT_LABEL = '[UI]Set show next label';
export class SetShowNextLabel implements Action {
  readonly type = SET_SHOW_NEXT_LABEL;

  constructor(public label: string) {}
}

export type All =
  | SetLanguage
  | SetSubHeaderTitle
  | SetShowPrevButton
  | SetShowNextButton
  | SetCurrentPage
  | SetNextPage
  | SetPrevPage
  | NavigateButtonClick
  | ClearNavigateState
  | SetShowStepper
  | SetLastStep
  | SetShowCancelSearch
  | SetSearchString
  | HideAllComponent
  | ClearUiInfo
  | SetShowNextLabel
  | SetShowSearchBox;
