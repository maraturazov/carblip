import {
  IColorExterior,
  IColorInterior,
} from 'app/shared/states/colors/colors.interfaces';

/**
 * pass a Color and return an Color with its properties + missing ones
 * this function might be helpful to initialize Colors coming from the server
 */
export function exteriorColorInitialState(
  color: IColorExterior
): IColorExterior {
  const emptyObj: IColorExterior = {
    id: null,
    color: '',
    simple_color: '',
    color_hex_code: '',
    priority: 0,
    VehicleColorsMedia: [],
    created_at: null,
    updated_at: null,
  };

  return {
    ...emptyObj,
    ...color,
    color_hex_code: color.color_hex_code.replace('#', ''),
  };
}

export function interiorColorInitialState(
  color: IColorInterior
): IColorInterior {
  const emptyObj: IColorInterior = {
    id: null,
    color: '',
    simple_color: '',
    color_hex_code: '',
    priority: 0,
    created_at: null,
    updated_at: null,
  };

  return {
    ...emptyObj,
    ...color,
    color_hex_code: color.color_hex_code.replace('#', ''),
  };
}
