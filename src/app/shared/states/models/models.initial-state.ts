import { IModel } from 'app/shared/states/models/models.interfaces';

/**
 * pass a brand and return an brand with its properties + missing ones
 * this function might be helpful to initialize brands coming from the server
 */
export function modelInitialState(brand: IModel): IModel {
  const emptyObj: IModel = {
    id: null,
    name: '',
    brand_id: null,
    image_url: '',
    min_price: 0,
    max_price: 0,
    created_at: null,
    updated_at: null,
  };

  return { ...emptyObj, ...brand };
}
