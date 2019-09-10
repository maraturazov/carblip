export interface IUserCarInformation {
  readonly own_a_car: number;
  readonly will_trade: number;
  readonly year: number;
  readonly brand_id: number;
  readonly model_id: number;
  readonly miles: number;
  readonly term_in_months: number;
  readonly lease_end_date: string;
}

export interface IRequest {
  readonly buying_time: number;
  readonly buying_method: number;
  readonly referral_code: Array<string>;
  readonly credit_score: number;
  readonly is_not_complete: number;
  readonly user_car_information: IUserCarInformation;
}
