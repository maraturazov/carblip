import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IRequestsGroup } from 'app/shared/states/my-request/myrequests.interfaces';

export const selectRequestsState = createFeatureSelector<IRequestsGroup>(
  'requests'
);

export const getRequestsAsArray = createSelector(
  selectRequestsState,
  requestState => Object.values(requestState.entities)
);
