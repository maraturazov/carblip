import {
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ModalModule } from 'ngx-bootstrap';

import { AppComponent } from 'app/app.component';
import { CoreModule } from 'app/core/core.module';
import { AppRoutingModule } from 'app/route/route.module';
import { SharedModule } from 'app/shared/shared.module';
import { environment } from 'environments/environment';
import { LayoutModule } from './layout/layout.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { ToastrModule } from 'ngx-toastr';

import { FormControlService } from 'app/shared/services/form-control.service';
import { ImageLoadService } from './shared/services/image-load.service';
import { NotificationService } from './shared/services/notification.service';

/**
 * this module should be kept as small as possible and shouldn't be modified
 * if you feel like you want to add something here, you should take a look into SharedModule or CoreModule
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    LayoutModule,
    FormsModule,
    EffectsModule.forRoot([]),
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    // use hash location strategy or not based on env
    {
      provide: LocationStrategy,
      useClass: environment.hashLocationStrategy
        ? HashLocationStrategy
        : PathLocationStrategy,
    },
    NotificationService,
    ImageLoadService,
    FormControlService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
