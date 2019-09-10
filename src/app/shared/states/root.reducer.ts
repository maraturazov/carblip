import { ActionReducer, ActionReducerMap } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { enableBatching } from 'redux-batched-actions';

import { IStore } from 'app/shared/interfaces/store.interface';
import { authReducer } from 'app/shared/states/auth/auth.reducer';
import { brandReducer } from 'app/shared/states/brands/brands.reducer';
import { colorReducer } from 'app/shared/states/colors/colors.reducer';
import { modelReducer } from 'app/shared/states/models/models.reducer';
import { requestsReducer } from 'app/shared/states/my-request/myrequests.reducer';
import { optionReducer } from 'app/shared/states/options/options.reducer';
import { requestReducer } from 'app/shared/states/request/request.reducer';
import { trimReducer } from 'app/shared/states/trim/trim.reducer';
import { uiReducer } from 'app/shared/states/ui/ui.reducer';
import { environment } from 'environments/environment';
import { localStorageSync } from 'ngrx-store-localstorage';
import { leaseReducer } from './lease/lease.reducer';

// ------------------------------------------------------------------------------

export const reducers: ActionReducerMap<IStore> = {
  // pass your reducers here
  ui: uiReducer,
  brand: brandReducer,
  model: modelReducer,
  auth: authReducer,
  trim: trimReducer,
  color: colorReducer,
  option: optionReducer,
  request: requestReducer,
  requests: requestsReducer,
  lease: leaseReducer,
};

// ------------------------------------------------------------------------------

export function localStorageSyncReducer(
  reducer: ActionReducer<IStore>
): ActionReducer<IStore> {
  return localStorageSync({
    keys: [
      'ui',
      'brand',
      'model',
      'auth',
      'trim',
      'color',
      'option',
      'request',
      'requests',
    ],
    rehydrate: true,
  })(reducer);
}

// if environment is != from production
// use storeFreeze to avoid state mutation
const metaReducersDev = [storeFreeze, enableBatching, localStorageSyncReducer];

// enableBatching allows us to dispatch multiple actions
// without letting the subscribers being warned between the actions
// only at the end : https://github.com/tshelburne/redux-batched-actions
// can be very handy when normalizing HTTP response
const metaReducersProd = [enableBatching, localStorageSyncReducer];

export const metaReducers = environment.production
  ? metaReducersProd
  : metaReducersDev;
