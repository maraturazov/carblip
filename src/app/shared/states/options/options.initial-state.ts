import { IOption } from 'app/shared/states/options/options.interfaces';

/**
 * pass a brand and return an brand with its properties + missing ones
 * this function might be helpful to initialize brands coming from the server
 */
export function optionInitialState(option: IOption): IOption {
  const emptyObj: IOption = {
    id: null,
    label: '',
    category: '',
    keywords: [],
  };

  return { ...emptyObj, ...option };
}
