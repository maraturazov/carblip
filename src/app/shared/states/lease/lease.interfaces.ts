import { IBrand } from '../brands/brands.interfaces';
import { IModel } from '../models/models.interfaces';

export interface ILease {
  readonly id: number;
  readonly user_id: number;
  readonly own_a_car: number;
  readonly will_trade: number;
  readonly year: number;
  readonly brand_id: number;
  readonly model_id: number;
  readonly term_in_months: null;
  readonly miles: number;
  readonly lease_end_date: string;
  readonly credit_score: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly Brand: IBrand;
  readonly Model: IModel;
}

export interface ILeaseGroup extends ILease {
  readonly fetching: boolean;
  readonly didFetch: boolean;
  readonly errors: Array<string>;
}
