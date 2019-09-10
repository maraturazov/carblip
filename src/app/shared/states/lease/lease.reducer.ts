import * as LeaseActions from './lease.actions';
import { ILeaseGroup } from './lease.interfaces';

const leaseGroupInitialState = {
  fetching: false,
  didFetch: true,
  errors: [],
  id: 0,
  user_id: 0,
  own_a_car: null,
  will_trade: null,
  year: 0,
  brand_id: 0,
  model_id: 0,
  miles: 0,
  term_in_months: null,
  lease_end_date: null,
  credit_score: null,
  created_at: null,
  updated_at: null,
  Brand: null,
  Model: null,
};

export function leaseReducer(
  state: ILeaseGroup = leaseGroupInitialState,
  action: LeaseActions.All
): any {
  switch (action.type) {
    case LeaseActions.FETCH_LEASE_INFO: {
      return {
        ...state,
        fetching: true,
        errors: [],
      };
    }

    case LeaseActions.FETCH_LEASE_INFO_SUCCESS: {
      return {
        ...state,
        ...action.payload,
        fetching: false,
      };
    }

    case LeaseActions.FFETCH_LEASE_INFO_FAILED: {
      return {
        ...state,
        fetching: false,
        errors: [...state.errors, action.payload.error],
      };
    }

    case LeaseActions.CLEAR_LEASE_INFO: {
      return {
        ...leaseGroupInitialState,
      };
    }

    default:
      return state;
  }
}
