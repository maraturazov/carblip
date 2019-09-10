import { ILease } from './lease.interfaces';

export function leaseInitialState(lease: ILease): ILease {
  const emptyObj: ILease = {
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

  return { ...emptyObj, ...lease };
}
