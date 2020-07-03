import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// tslint:disable-next-line: max-line-length
import { FamilyFormComponent } from '../families/family-form/family-form.component';
import { FamilyModule } from '../families/family.module';
import { HomePageComponent } from './home-page/home-page.component';
import { HomeRoutingModule } from './home-routing.module';
// tslint:disable-next-line: max-line-length
import { RegistrationBannerComponent } from './registration-banner/registration-banner.component';
import { SectionComponent } from './section/section.component';

@NgModule({
  declarations: [
    HomePageComponent,
    RegistrationBannerComponent,
    SectionComponent
  ],
  imports: [
    CommonModule,
    FamilyModule,
    HomeRoutingModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [HomePageComponent],
  entryComponents: [FamilyFormComponent]
})
export class HomeModule {}
