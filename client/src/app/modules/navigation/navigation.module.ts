import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  MatMenuModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatListModule
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

import { SharedModule } from "../shared/shared.module";
import { PaymentModule } from "../payments/payment.module";
import { FamilyModule } from "../families/family.module";

import { AppRoutingModule } from "src/app/app-routing.module";

import { MainNavLogoComponent } from "./main-nav-logo/main-nav-logo.component";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { MainToolbarComponent } from "./main-toolbar/main-toolbar.component";
import { SideNavToolbarComponent } from "./side-nav-toolbar/side-nav-toolbar.component";

@NgModule({
  declarations: [
    MainToolbarComponent,
    SideNavComponent,
    MainNavLogoComponent,
    SideNavToolbarComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,

    AppRoutingModule,
    PaymentModule,
    FamilyModule,
    SharedModule
  ],
  exports: [MainToolbarComponent, SideNavComponent, SideNavToolbarComponent]
})
export class NavigationModule {}
