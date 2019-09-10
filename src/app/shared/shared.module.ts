import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule, TabsModule } from 'ngx-bootstrap';

import { AppLoaderComponent } from 'app/shared/component/loader/loader.component';

/**
 * Ngrx Effects
 */

import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './states/auth/auth.effects';
import { AuthServiceImpl } from './states/auth/auth.service';
import { BrandsEffects } from './states/brands/brands.effects';
import { BrandsServiceImpl } from './states/brands/brands.service';
import { ColorEffects } from './states/colors/colors.effects';
import { ColorServiceImpl } from './states/colors/colors.service';
import { LeaseEffects } from './states/lease/lease.effects';
import { LeaseServiceImpl } from './states/lease/lease.service';
import { ModelsEffects } from './states/models/models.effects';
import { ModelsServiceImpl } from './states/models/models.service';
import { RequestsEffects } from './states/my-request/myrequests.effects';
import { RequestsServiceImpl } from './states/my-request/myrequests.service';
import { OptionEffects } from './states/options/options.effects';
import { OptionServiceImpl } from './states/options/options.service';
import { TrimEffects } from './states/trim/trim.effects';
import { TrimServiceImpl } from './states/trim/trim.service';

/**
 * Services
 */

/**
 * this module should be imported in every sub-modules
 * you can define here the modules, components, pipes that you want to re-use all over your app
 */
export const modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  FlexLayoutModule,
  StoreModule,
  TranslateModule,
  TabsModule,
  NgSelectModule,
  BsDatepickerModule,
];

export const declarations = [AppLoaderComponent];

@NgModule({
  imports: [
    ...modules,
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    EffectsModule.forFeature([
      AuthEffects,
      BrandsEffects,
      ModelsEffects,
      TrimEffects,
      ColorEffects,
      OptionEffects,
      RequestsEffects,
      LeaseEffects,
    ]),
  ],
  exports: [...modules, ...declarations],
  declarations,
  providers: [
    BrandsServiceImpl,
    ModelsServiceImpl,
    TrimServiceImpl,
    AuthServiceImpl,
    ColorServiceImpl,
    OptionServiceImpl,
    RequestsServiceImpl,
    LeaseServiceImpl,
  ],
})
export class SharedModule {}
