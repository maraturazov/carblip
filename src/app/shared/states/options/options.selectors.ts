import { createFeatureSelector, createSelector } from '@ngrx/store';

import { optionAdapter } from 'app/shared/states/options/options.reducer';

import { IOptionGroup } from 'app/shared/states/options/options.interfaces';

export const optionState = createFeatureSelector<IOptionGroup>('option');

export const {
  // select the array of preferred option ids
  selectIds: selectoptionIds,

  // select the dictionary of preferred option entities
  selectEntities: selectoptionEntities,

  // select the array of preferred option
  selectAll: selectAlloption,

  // select the total preferred option count
  selectTotal: selectoptionTotal,
} = optionAdapter.getSelectors();

// by using the createSelector function you'll be able to
// keep excellent performance thanks to memoization
export const getSelectedoptions = createSelector(
  optionState,
  state => state.selected
);

export const getoptionsAsArray = createSelector(
  optionState,
  state => Object.values(state.entities)
);
