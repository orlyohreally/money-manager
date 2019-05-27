import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { SharedModule } from "../shared/shared.module";
import {
  MatMenuModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatExpansionModule
} from "@angular/material";
import { MainNavLogoComponent } from "./main-nav-logo/main-nav-logo.component";
import { UserMenuComponent } from "./user-menu/user-menu.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { PaymentModule } from "../payments/payment.module";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { SideNavBlockComponent } from "./side-nav-block/side-nav-block.component";
import { FamilyModule } from "../families/family.module";

@NgModule({
  declarations: [
    MainNavComponent,
    MainNavLogoComponent,
    UserMenuComponent,
    SideNavComponent,
    SideNavBlockComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,

    PaymentModule,
    FamilyModule,
    SharedModule
  ],
  exports: [MainNavComponent, MainNavLogoComponent, UserMenuComponent]
})
export class NavigationModule {}
