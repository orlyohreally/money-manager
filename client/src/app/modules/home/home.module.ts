import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatButtonModule, MatDialogModule } from "@angular/material";

import { HomePageComponent } from "./home-page/home-page.component";
import { RegistrationBannerComponent } from "./registration-banner/registration-banner.component";
import { SectionComponent } from "./section/section.component";
import { FamilyModule } from "../families/family.module";
import { FamilyFormComponent } from "../families/family-form/family-form.component";
import { HomeRoutingModule } from "./home-routing.module";

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
