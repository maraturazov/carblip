import { IBrandsGroup } from 'app/shared/states/brands/brands.interfaces';
import { IColorGroup } from 'app/shared/states/colors/colors.interfaces';
import { IModelsGroup } from 'app/shared/states/models/models.interfaces';
import { IRequestsGroup } from 'app/shared/states/my-request/myrequests.interfaces';
import { IOptionGroup } from 'app/shared/states/options/options.interfaces';
import { IRequest } from 'app/shared/states/request/request.interface';
import { ITrimGroup } from 'app/shared/states/trim/trim.interfaces';
import { IUi } from 'app/shared/states/ui/ui.interface';
import { IAuthGroup } from '../states/auth/auth.interfaces';
import { ILeaseGroup } from '../states/lease/lease.interfaces';

export interface IStore {
  readonly ui: IUi;
  readonly brand: IBrandsGroup;
  readonly model: IModelsGroup;
  readonly auth: IAuthGroup;
  readonly trim: ITrimGroup;
  readonly color: IColorGroup;
  readonly option: IOptionGroup;
  readonly request: IRequest;
  readonly requests: IRequestsGroup;
  readonly lease: ILeaseGroup;
}
