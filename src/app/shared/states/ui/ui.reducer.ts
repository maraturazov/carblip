import { createFeatureSelector } from '@ngrx/store';

import * as UiActions from 'app/shared/states/ui/ui.actions';
import { uiInitialState } from 'app/shared/states/ui/ui.initial-state';
import { IUi } from 'app/shared/states/ui/ui.interface';

export const selectUiState = createFeatureSelector<IUi>('ui');

export function uiReducer(
  ui: IUi = uiInitialState(),
  action: UiActions.All
): IUi {
  switch (action.type) {
    case UiActions.SET_LANGUAGE: {
      return {
        ...ui,
        language: action.payload.language,
      };
    }

    case UiActions.SET_SUBHEADER_TITLE: {
      return {
        ...ui,
        subHeaderTitle: action.title,
      };
    }

    case UiActions.SET_LAST_STEP: {
      return {
        ...ui,
        lastStep: action.page,
      };
    }

    case UiActions.SET_SHOW_PREV_BUTTON: {
      return {
        ...ui,
        showPrevButton: action.value,
      };
    }

    case UiActions.SET_SHOW_NEXT_BUTTON: {
      return {
        ...ui,
        showNextButton: action.value,
      };
    }

    case UiActions.SET_SHOW_SEARCH_BOX: {
      return {
        ...ui,
        showSearchBox: action.value,
        searchString: null,
      };
    }

    case UiActions.SET_SEARCH_STRING: {
      return {
        ...ui,
        searchString: action.value,
      };
    }

    case UiActions.SET_CURRENT_PAGE: {
      return {
        ...ui,
        currentPage: action.page,
      };
    }

    case UiActions.NAVIGATE_BUTTON_CLICK: {
      return {
        ...ui,
        navigateButtonClick: action.payload,
      };
    }

    case UiActions.CLEAR_NAVIGATE_STATE: {
      return {
        ...ui,
        navigateButtonClick: {
          type: '',
          click: false,
        },
        nextButtonLabel: 'Next',
      };
    }

    case UiActions.SET_SHOW_STEPPER: {
      return {
        ...ui,
        showStepper: action.value,
      };
    }

    case UiActions.SET_SHOW_CANCEL_SEARCH: {
      return {
        ...ui,
        showCancelSearch: action.value,
      };
    }

    case UiActions.HIDE_ALL_COMPONENT: {
      return {
        ...ui,
        showPrevButton: false,
        showNextButton: false,
        showStepper: false,
        showCancelSearch: false,
        showSearchBox: false,
        searchString: null,
      };
    }

    case UiActions.CLEAR_UI_INFO: {
      return {
        ...uiInitialState(),
      };
    }

    case UiActions.SET_SHOW_NEXT_LABEL: {
      return {
        ...ui,
        nextButtonLabel: action.label,
      };
    }

    default:
      return ui;
  }
}
