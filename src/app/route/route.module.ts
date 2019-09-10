import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {
  NoPreloading,
  PreloadAllModules,
  RouterModule,
  Routes,
} from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { environment } from 'environments/environment';
// if you don't want to lazy load the features module,
// simply put the loadFeaturesModule as value of loadChildren
// import { FeaturesModule } from './features/features.module';

// export function loadFeaturesModule() {
//   return FeaturesModule;
// }

import { LayoutComponent } from 'app/layout/layout.component';
import { FaqComponent } from 'app/route/faq/faq.component';
import { LogoutComponent } from 'app/route/logout/logout.component';
import { MyRequestComponent } from 'app/route/my-request/my-request.component';
import { RegisterComponent } from 'app/route/register/register.component';

import { AuthGuard } from 'app/shared/services/auth.guard';
import { SearchResultService } from 'app/shared/services/search-result.service';
import { ProfileVerifyComponent } from './modals/profile-verify/profile-verify.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'find-my-car', pathMatch: 'full' },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'my-request',
        component: MyRequestComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'find-my-car',
        loadChildren: './find-my-car/find-my-car.module#FindMyCarModule',
      },
      {
        path: 'faq',
        component: FaqComponent,
      },
      {
        path: 'profile-settings',
        component: ProfileSettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
    ],
  },
  // Not found
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: environment.preloadAllLazyLoadedModules
        ? PreloadAllModules
        : NoPreloading,
    }),
  ],
  exports: [RouterModule, SharedModule],
  declarations: [
    RegisterComponent,
    FaqComponent,
    ProfileSettingsComponent,
    ProfileVerifyComponent,
    MyRequestComponent,
    LogoutComponent,
  ],
  providers: [AuthGuard, SearchResultService],
  entryComponents: [ProfileVerifyComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule {}
