import { createSelector } from '@ngrx/store';

import { selectUiState } from './ui.reducer';

export const getLanguage = createSelector(
  selectUiState,
  uiState => uiState.language
);

export const getSubHeaderTitle = createSelector(
  selectUiState,
  uiState => uiState.subHeaderTitle
);

export const getCurrentStep = createSelector(
  selectUiState,
  uiState => uiState.currentPage
);

export const getLastStep = createSelector(
  selectUiState,
  uiState => uiState.lastStep
);

export const getNextButtonLabel = createSelector(
  selectUiState,
  uiState => uiState.nextButtonLabel
);

export const getSearchString = createSelector(
  selectUiState,
  uiState => uiState.searchString
);
