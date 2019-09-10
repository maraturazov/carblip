import { IRequest } from 'app/shared/states/request/request.interface';

export function requestInitialState(): IRequest {
  return {
    buying_time: null,
    buying_method: null,
    referral_code: [],
    credit_score: null,
    is_not_complete: 0,
    user_car_information: {
      own_a_car: null,
      will_trade: null,
      year: null,
      brand_id: null,
      model_id: null,
      miles: null,
      term_in_months: null,
      lease_end_date: '',
    },
  };
}
