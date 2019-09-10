import { EntityState } from '@ngrx/entity';

// ------------------
// FOR A SINGLE MODEL
// ------------------
// definition of a Trim as it is on the backend
export interface ITrim {
  readonly id: string;
  readonly name: string;
  readonly brand_id: string;
  readonly image_url: string;
  readonly min_price: number;
  readonly max_price: number;
  readonly created_at: string;
  readonly updated_at: string;
  readonly trim: string;
  readonly year: string;
  readonly Brand: any;
  readonly VehicleInventories: Array<any>;
}

// ----------------------------------------------------------------------------

// -------------------
// FOR MULTIPLE MODELS
// -------------------
// definition of the Trim with `ids` and `entities` for state normalization
// thanks to ngrx entity we do not manipulate `ids` and `entities` directly
export interface ITrimGroup extends EntityState<ITrim> {
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
// definition of the Trim for Fetch List api request
export interface IRequestFecthList {
  readonly zip: string;
  readonly min_price: number;
  readonly max_price: number;
  readonly models: any;
}
