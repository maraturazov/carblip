import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import * as RequestsAcions from 'app/shared/states/my-request/myrequests.actions';

import {
  IRequest,
  IRequestsGroup,
} from 'app/shared/states/my-request/myrequests.interfaces';

export const requestsAdapter: EntityAdapter<IRequest> = createEntityAdapter<
  IRequest
>({
  selectId: (request: IRequest) => request.id,
  sortComparer: false,
});

const requestsInitialState = requestsAdapter.getInitialState({
  selected: null,
  fetching: false,
  didFetch: false,
  errors: [],
});

export function requestsReducer(
  state: IRequestsGroup = requestsInitialState,
  action: RequestsAcions.All
): IRequestsGroup {
  switch (action.type) {
    case RequestsAcions.FETCH_REQUEST_LIST: {
      return {
        ...state,
        fetching: true,
        didFetch: false,
        errors: [],
      };
    }

    case RequestsAcions.FETCH_REQUEST_LIST_SUCCESS: {
      return requestsAdapter.addAll(action.payload.data, {
        ...state,
        fetching: false,
        didFetch: true,
        errors: [],
      });
    }

    case RequestsAcions.FETCH_REQUEST_LIST_FAILED: {
      return {
        ...state,
        fetching: false,
        didFetch: true,
        errors: [...state.errors, action.payload.error],
      };
    }

    case RequestsAcions.CLEAR_REQUEST_LIST: {
      return {
        ...requestsInitialState,
      };
    }

    default:
      return state;
  }
}
