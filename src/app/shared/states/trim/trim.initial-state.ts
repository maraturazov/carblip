import { ITrim } from 'app/shared/states/trim/trim.interfaces';

/**
 * pass a brand and return an brand with its properties + missing ones
 * this function might be helpful to initialize brands coming from the server
 */
export function trimInitialState(brand: ITrim): ITrim {
  const emptyObj: ITrim = {
    id: null,
    name: '',
    brand_id: null,
    image_url: '',
    min_price: 0,
    max_price: 0,
    created_at: null,
    updated_at: null,
    trim: '',
    year: '',
    Brand: null,
    VehicleInventories: null,
  };

  return { ...emptyObj, ...brand };
}
