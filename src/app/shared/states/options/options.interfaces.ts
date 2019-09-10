import { EntityState } from '@ngrx/entity';
// ------------------
// FOR A COMMON PREFERRED OPTIOIN
// ------------------
export interface IOption {
  readonly id: number;
  readonly label: string;
  readonly category: string;
  readonly keywords: Array<string>;
}

// ----------------------------------------------------------------------------

// -------------------
// FOR MULTIPLE PREFERRED OPTIOINS
// -------------------
// definition of the Trim with `ids` and `entities` for state normalization
// thanks to ngrx entity we do not manipulate `ids` and `entities` directly
export interface IOptionGroup extends EntityState<IOption> {
  // additional entity state properties
  readonly selected: Array<number>;
  readonly fetching: boolean;
  readonly didFetch: boolean;
  readonly errors: Array<string>;
}

// -------------------
// FOR FETCH API REQUEST
// -------------------
// definition of the Request for Fetch List api
export interface IRequestFecthList {
  readonly vehicles: Array<string>;
}
