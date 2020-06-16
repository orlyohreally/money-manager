import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatToolbarModule
} from '@angular/material';

import { FamilyModule } from '../families/family.module';
import { PaymentModule } from '../payments/payment.module';
import { SharedModule } from '../shared/shared.module';

import { AppRoutingModule } from 'src/app/app-routing.module';

import { FooterComponent } from './footer/footer.component';
import { MainNavLogoComponent } from './main-nav-logo/main-nav-logo.component';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
// tslint:disable-next-line: max-line-length
import { SideNavAuthenticatedUserComponent } from './side-nav-authenticated-user/side-nav-authenticated-user.component';
// tslint:disable-next-line: max-line-length
import { SideNavToolbarComponent } from './side-nav-toolbar/side-nav-toolbar.component';
// tslint:disable-next-line: max-line-length
import { SideNavUnauthenticatedUserComponent } from './side-nav-unauthenticated-user/side-nav-unauthenticated-user.component';
import { SideNavComponent } from './side-nav/side-nav.component';
// tslint:disable-next-line: max-line-length
import { UserMenuOpenerComponent } from './user-menu-opener/user-menu-opener.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

@NgModule({
  declarations: [
    MainToolbarComponent,
    SideNavComponent,
    MainNavLogoComponent,
    SideNavToolbarComponent,
    SideNavAuthenticatedUserComponent,
    SideNavUnauthenticatedUserComponent,
    UserMenuComponent,
    UserMenuOpenerComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,

    AppRoutingModule,
    PaymentModule,
    FamilyModule,
    SharedModule
  ],
  exports: [
    MainToolbarComponent,
    SideNavComponent,
    SideNavToolbarComponent,
    FooterComponent
  ]
})
export class NavigationModule {}
