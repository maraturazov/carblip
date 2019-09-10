import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import * as ColorActions from 'app/shared/states/colors/colors.actions';

import { LIMIT_COLORS } from 'app/core/constant';

import { IColorGroup } from 'app/shared/states/colors/colors.interfaces';

export const colorAdapter: EntityAdapter<any> = createEntityAdapter<any>({});

const colorInitialState = {
  interior: [],
  exterior: [],
  exterior_selected: [],
  interior_selected: [],
  fetching: false,
  didFetch: false,
  errors: [],
  limited_colors: LIMIT_COLORS,
  exterior_selection_status: [],
  interior_selection_status: [],
};

export function colorReducer(
  state: IColorGroup = colorInitialState,
  action: ColorActions.All
): IColorGroup {
  switch (action.type) {
    case ColorActions.FETCH_COLOR_LIST: {
      return {
        ...state,
        fetching: true,
        didFetch: false,
        errors: [],
      };
    }

    case ColorActions.FETCH_COLOR_LIST_SUCCESS: {
      const exterior_selection_status = [];
      const interior_selection_status = [];
      action.payload.data.interior.forEach(item => {
        interior_selection_status.push(false);
      });
      action.payload.data.exterior.forEach(item => {
        exterior_selection_status.push(false);
      });
      return {
        ...state,
        interior: action.payload.data.interior,
        exterior: action.payload.data.exterior,
        fetching: false,
        didFetch: true,
        exterior_selection_status: exterior_selection_status,
        interior_selection_status: interior_selection_status,
        errors: [],
      };
    }

    case ColorActions.FETCH_COLOR_LIST_FAILED: {
      return {
        ...state,
        fetching: false,
        didFetch: true,
        errors: [...state.errors, action.payload.error],
      };
    }

    case ColorActions.SELECT_COLOR: {
      const payload = action.payload;
      let exterior_selection_status = [];
      let interior_selection_status = [];
      let formattedData: any;
      let interior_selected = [];
      let exterior_selected = [];
      state.exterior_selection_status.forEach(item => {
        exterior_selection_status.push(item ? true : false);
      });
      state.interior_selection_status.forEach(item => {
        interior_selection_status.push(item ? true : false);
      });
      state.interior_selected.forEach(item => {
        interior_selected.push(item);
      });
      state.exterior_selected.forEach(item => {
        exterior_selected.push(item);
      });
      switch (payload.type) {
        case 'interior':
          formattedData = formatStatus(
            state.interior_selected,
            state.interior_selection_status,
            state.limited_colors,
            payload
          );
          interior_selected = formattedData.selected;
          interior_selection_status = formattedData.selection_status;
          break;
        case 'exterior':
          formattedData = formatStatus(
            state.exterior_selected,
            state.exterior_selection_status,
            state.limited_colors,
            payload
          );
          exterior_selected = formattedData.selected;
          exterior_selection_status = formattedData.selection_status;
          break;
      }
      return {
        ...state,
        exterior_selected: exterior_selected,
        interior_selected: interior_selected,
        exterior_selection_status: exterior_selection_status,
        interior_selection_status: interior_selection_status,
        // current_car_image: current_car_image,
      };
    }

    case ColorActions.CLEAR_COLOR_LIST: {
      return {
        ...colorInitialState,
      };
    }

    default:
      return state;
  }
}

function formatStatus(
  type_selected,
  type_selection_status,
  limited_colors,
  payload
) {
  const selection_status = [];
  let selected = [];
  type_selection_status.forEach(item => {
    selection_status.push(item ? true : false);
  });
  type_selected.forEach(item => {
    selected.push(item);
  });
  if (payload.selection) {
    selected.splice(selected.indexOf(payload.data), 1);
    selection_status[payload.index] = !payload.selection;
  } else if (limited_colors !== selected.length) {
    selected = selected.concat(payload.data);
    selection_status[payload.index] = !payload.selection;
  }
  return { selection_status, selected };
}
