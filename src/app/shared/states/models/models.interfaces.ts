import { EntityState } from '@ngrx/entity';

// ------------------
// FOR A SINGLE MODEL
// ------------------
// definition of a Model as it is on the backend
export interface IModel {
  readonly id: string;
  readonly name: string;
  readonly brand_id: string;
  readonly image_url: string;
  readonly min_price: number;
  readonly max_price: number;
  readonly created_at: string;
  readonly updated_at: string;
}

// ----------------------------------------------------------------------------

// -------------------
// FOR MULTIPLE MODELS
// -------------------
// definition of the Models with `ids` and `entities` for state normalization
// thanks to ngrx entity we do not manipulate `ids` and `entities` directly
export interface IModelsGroup extends EntityState<IModel> {
  // additional entity state properties
  readonly selected: number;
  readonly fetching: boolean;
  readonly didFetch: boolean;
  readonly errors: Array<string>;
}

// ----------------------------------------------------------------------------

// -------------------
// FOR FETCH API REQUEST
// -------------------
// definition of the Models for Fetch List api request
export interface IRequestFecthList {
  readonly brand_id: number;
  readonly min_price: number;
  readonly max_price: number;
}
