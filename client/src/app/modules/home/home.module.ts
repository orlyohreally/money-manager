import { NgModule } from "@angular/core";

import { HomePageComponent } from "./home-page/home-page.component";
import { RegistrationBannerComponent } from "./registration-banner/registration-banner.component";
import { SectionComponent } from "./section/section.component";
import { MatButtonModule, MatDialogModule } from "@angular/material";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { FamilyModule } from "../families/family.module";
import { FamilyFormComponent } from "../families/family-form/family-form.component";
import { PaymentFormComponent } from "../payments/payment-form/payment-form.component";

@NgModule({
  declarations: [
    HomePageComponent,
    RegistrationBannerComponent,
    SectionComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    FamilyModule
  ],
  exports: [HomePageComponent],
  entryComponents: [FamilyFormComponent, PaymentFormComponent]
})
export class HomePageModule {}
