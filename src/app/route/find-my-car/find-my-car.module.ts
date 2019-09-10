import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'app/shared/services/auth.guard';
import { SharedModule } from 'app/shared/shared.module';
import { BrandComponent } from './brand/brand.component';
import { ColorComponent } from './color/color.component';
import { CreditComponent } from './credit/credit.component';
import { ModelComponent } from './model/model.component';
import { OptionsComponent } from './options/options.component';
import { ReviewInfoComponent } from './review-info/review-info.component';
import { ReviewComponent } from './review/review.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ThankYouComponent } from './thankyou/thankYou.component';
import { TrimComponent } from './trim/trim.component';

import { CreateRequestService } from 'app/shared/services/create-request.service';
import { SearchResultService } from 'app/shared/services/search-result.service';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'brand', pathMatch: 'full' },
      { path: 'brand', component: BrandComponent },
      { path: 'model', component: ModelComponent },
      { path: 'trim', component: TrimComponent },
      { path: 'color-selection', component: ColorComponent },
      { path: 'spec', component: OptionsComponent },
      { path: 'review', component: ReviewComponent },
      {
        path: 'review-info',
        component: ReviewInfoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'thank-you',
        component: ThankYouComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'credit-assessment',
        component: CreditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'search-result',
        component: SearchResultComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  declarations: [
    BrandComponent,
    ModelComponent,
    TrimComponent,
    ColorComponent,
    ReviewComponent,
    OptionsComponent,
    ReviewComponent,
    ThankYouComponent,
    CreditComponent,
    ReviewInfoComponent,
    SearchResultComponent,
  ],
  exports: [RouterModule],
  providers: [SearchResultService, CreateRequestService],
})
export class FindMyCarModule {}
