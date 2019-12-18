import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatMenuModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatDialogModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from '../shared/shared.module';
import { PaymentModule } from '../payments/payment.module';
import { FamilyModule } from '../families/family.module';

import { AppRoutingModule } from 'src/app/app-routing.module';

import { MainNavLogoComponent } from './main-nav-logo/main-nav-logo.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { SideNavToolbarComponent } from './side-nav-toolbar/side-nav-toolbar.component';
import { SideNavAuthenticatedUserComponent } from './side-nav-authenticated-user/side-nav-authenticated-user.component';
import { SideNavUnauthenticatedUserComponent } from './side-nav-unauthenticated-user/side-nav-unauthenticated-user.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

@NgModule({
  declarations: [
    MainToolbarComponent,
    SideNavComponent,
    MainNavLogoComponent,
    SideNavToolbarComponent,
    SideNavAuthenticatedUserComponent,
    SideNavUnauthenticatedUserComponent,
    UserMenuComponent
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
  exports: [MainToolbarComponent, SideNavComponent, SideNavToolbarComponent]
})
export class NavigationModule {}
