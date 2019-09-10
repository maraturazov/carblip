import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import * as optionActions from 'app/shared/states/options/options.actions';

import {
  IOption,
  IOptionGroup,
} from 'app/shared/states/options/options.interfaces';

export const optionAdapter: EntityAdapter<IOption> = createEntityAdapter<
  IOption
>({
  selectId: (option: IOption) => option.id,
  sortComparer: false,
});

const optionInitialState = optionAdapter.getInitialState({
  selected: [],
  fetching: false,
  didFetch: false,
  errors: [],
});

export function optionReducer(
  state: IOptionGroup = optionInitialState,
  action: optionActions.All
): IOptionGroup {
  switch (action.type) {
    case optionActions.FETCH_OPTION_LIST: {
      return {
        ...state,
        fetching: true,
        didFetch: false,
        errors: [],
      };
    }

    case optionActions.FETCH_OPTION_LIST_SUCCESS: {
      return optionAdapter.addAll(action.payload.data, {
        ...state,
        fetching: false,
        didFetch: true,
        errors: [],
      });
    }

    case optionActions.FETCH_OPTION_LIST_FAILED: {
      return {
        ...state,
        fetching: false,
        didFetch: true,
        errors: [...state.errors, action.payload.error],
      };
    }

    case optionActions.SELECT_OPTION: {
      const selected = [];
      state.selected.forEach(item => {
        selected.push(item);
      });
      if (action.payload.checked) {
        if (selected.indexOf(action.payload.id) === -1) {
          selected.push(action.payload.id);
        }
      } else {
        selected.splice(selected.indexOf(action.payload.id), 1);
      }
      return {
        ...state,
        selected: selected,
      };
    }

    case optionActions.CLEAR_OPTION_LIST: {
      return {
        ...optionInitialState,
      };
    }

    default:
      return state;
  }
}
