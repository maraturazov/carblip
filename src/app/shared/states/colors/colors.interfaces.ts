// ------------------
// FOR A COMMON COLOR STRUCTURE
// ------------------
export interface IColorStructure {
  readonly id: number;
  readonly color: string;
  readonly simple_color: string;
  readonly color_hex_code: string;
  readonly priority: number;
  readonly created_at: string;
  readonly updated_at: string;
}

// ------------------
// FOR A VEHICLE_COLOR_MEDIA
// ------------------
export interface IVehicleColorsMediaStructure {
  readonly id: number;
  readonly vehicle_color_id: number;
  readonly image_url: string;
  readonly fuel_format_id: number;
  readonly created_at: string;
  readonly updated_at: string;
}

// ------------------
// FOR A SINGLE COLOR INTERIOR
// ------------------
// definition of a Interior Color
export interface IColorInterior extends IColorStructure {}

// ------------------
// FOR A SINGLE COLOR EXTERIOR
// ------------------
// definition of a Exterior Color
export interface IColorExterior extends IColorStructure {
  readonly VehicleColorsMedia: Array<IVehicleColorsMediaStructure>;
}

// ------------------
// FOR MULTIPLE COLORS
// ------------------
// definition of a Exterior Color
export interface IColors {
  readonly interior: Array<IColorInterior>;
  readonly exterior: Array<IColorExterior>;
}

// ----------------------------------------------------------------------------

// -------------------
// FOR COLOR STORE
// -------------------
// definition of the Trim with `ids` and `entities` for state normalization
// thanks to ngrx entity we do not manipulate `ids` and `entities` directly
export interface IColorGroup extends IColors {
  // additional entity state properties
  readonly exterior_selected: Array<number>;
  readonly interior_selected: Array<number>;
  readonly fetching: boolean;
  readonly didFetch: boolean;
  readonly errors: Array<string>;
  readonly limited_colors: number;
  readonly interior_selection_status: Array<boolean>;
  readonly exterior_selection_status: Array<boolean>;
}

// ----------------------------------------------------------------------------

// -------------------
// FOR FETCH API REQUEST
// -------------------
// definition of the Request for Fetch List api
export interface IRequestFecthList {
  readonly vehicles: Array<string>;
}
