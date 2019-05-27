import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatSnackBarModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MAT_DATE_LOCALE,
  MatSidenavModule
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { PaymentsService } from "@shared-client/services/payments/payments.service";
import { PageNotFoundComponent } from "./modules/errors/page-not-found/page-not-found.component";
import { HttpClientModule } from "@angular/common/http";
import { HomePageModule } from "./modules/home/home.module";
import { AuthModule } from "./modules/auth/auth.module";
import { NavigationModule } from "./modules/navigation/navigation.module";
import { PaymentModule } from "./modules/payments/payment.module";
@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,

    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    FlexLayoutModule,
    HttpClientModule,

    HomePageModule,
    AuthModule,
    NavigationModule,
    PaymentModule
  ],
  providers: [PaymentsService],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
