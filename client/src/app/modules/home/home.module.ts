import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// tslint:disable-next-line: max-line-length
import { FamilyFormComponent } from '../families/family-form/family-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
// tslint:disable-next-line: max-line-length

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    HomeRoutingModule,
    FlexLayoutModule
  ],
  exports: [HomePageComponent],
  entryComponents: [FamilyFormComponent]
})
export class HomeModule {}
