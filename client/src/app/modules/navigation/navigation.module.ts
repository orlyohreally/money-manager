import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { SharedModule } from "../shared/shared.module";
import {
  MatMenuModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule
} from "@angular/material";
import { MainNavLogoComponent } from "./main-nav-logo/main-nav-logo.component";
import { UserMenuComponent } from "./user-menu/user-menu.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PaymentModule } from "../payments/payment.module";

@NgModule({
  declarations: [MainNavComponent, MainNavLogoComponent, UserMenuComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,

    SharedModule,
    PaymentModule
  ],
  exports: [MainNavComponent, MainNavLogoComponent, UserMenuComponent]
})
export class NavigationModule {}
