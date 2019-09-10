import { IRequest } from 'app/shared/states/my-request/myrequests.interfaces';

export function requestInitialState(request: IRequest): IRequest {
  const emptyObj: IRequest = {
    id: '',
  };

  return { ...emptyObj, ...request };
}
