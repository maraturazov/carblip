import { EntityState } from '@ngrx/entity';

export interface IRequest {
  readonly id: string;
}

export interface IRequestsGroup extends EntityState<IRequest> {
  readonly selected: number;
  readonly fetching: boolean;
  readonly didFetch: boolean;
  readonly errors: Array<string>;
}
