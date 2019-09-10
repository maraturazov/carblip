import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [LayoutComponent, HeaderComponent, SubHeaderComponent],
  exports: [LayoutComponent, HeaderComponent, SubHeaderComponent],
})
export class LayoutModule {}
