import { createFeatureSelector, createSelector } from '@ngrx/store';

import { DEFAULT_IMAGE_FUEL_ID } from 'app/core/constant';
import {
  IColorExterior,
  IColorGroup,
  IColorInterior,
} from 'app/shared/states/colors/colors.interfaces';

export const colorState = createFeatureSelector<IColorGroup>('color');

// by using the createSelector function you'll be able to
// keep excellent performance thanks to memoization

export const getInteriorColorList = createSelector(
  colorState,
  state => state.interior
);

export const getExteriorColorList = createSelector(
  colorState,
  state => state.exterior
);

export const getSelectedInteriorColorList = createSelector(
  colorState,
  state => state.interior_selected
);

export const getSelectedExteriorColorList = createSelector(
  colorState,
  state => state.exterior_selected
);

export const selectCurrentExteriorColors = createSelector(
  colorState,
  getSelectedExteriorColorList,
  ({ exterior }, ids) => {
    const res: IColorExterior[] = [];
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < exterior.length; j++) {
        if (ids[i] === exterior[j].id) {
          res.push(exterior[j]);
        }
      }
    }
    return res;
  }
);

export const selectCurrentInteriorColors = createSelector(
  colorState,
  getSelectedInteriorColorList,
  ({ interior }, ids) => {
    const res: IColorInterior[] = [];
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < interior.length; j++) {
        if (ids[i] === interior[j].id) {
          res.push(interior[j]);
        }
      }
    }
    return res;
  }
);

export const getInteriorSelectionList = createSelector(
  colorState,
  state => state.interior_selection_status
);

export const getExteriorSelectionList = createSelector(
  colorState,
  state => state.exterior_selection_status
);

export const getBackgroundImage = createSelector(
  colorState,
  state => {
    let url = '';
    if (!state.exterior_selected.length) {
      const highPriority = Math.max.apply(
        Math,
        state.exterior.map(item => item.priority)
      );
      const obj: IColorExterior = state.exterior.find(
        item => item.priority === highPriority
      );
      if (obj) {
        const vehicleColorObj = obj.VehicleColorsMedia.find(
          item => item.fuel_format_id === DEFAULT_IMAGE_FUEL_ID
        );
        url = vehicleColorObj && vehicleColorObj.image_url;
      }
    } else {
      const exteriorId =
        state.exterior_selected[state.exterior_selected.length - 1];
      const vehicleColorObj = state.exterior
        .find(exterior => exterior.id === exteriorId)
        .VehicleColorsMedia.find(
          item => item.fuel_format_id === DEFAULT_IMAGE_FUEL_ID
        );
      url = vehicleColorObj && vehicleColorObj.image_url;
    }
    return url;
  }
);
