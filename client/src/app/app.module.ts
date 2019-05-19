import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MglTimelineModule } from "angular-mgl-timeline";
import { AppRoutingModule } from "./app-routing.module";
import {
  MatSnackBarModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatDialogModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MatMenuModule,
  MAT_DATE_LOCALE
} from "@angular/material";
import { AppComponent } from "./app.component";
import { PaymentsTimelineComponent } from "./payments-timeline/payments-timeline.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { PaymentsService } from "./payments.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaymentFormComponent } from "./payment-form/payment-form.component";
import { PaymentTimelineEntryComponent } from "./payment-timeline-entry/payment-timeline-entry.component";
import { NewPaymentComponent } from "./new-payment/new-payment.component";
import { TotalPaymentEntryComponent } from "./total-payment-entry/total-payment-entry.component";
import { MoneyAmountComponent } from "./money-amount/money-amount.component";
import { PaymentSubjectComponent } from "./payment-subject/payment-subject.component";
import { MemberPaymentTimelineComponent } from "./member-payment-timeline/member-payment-timeline.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { MainMenuEntryComponent } from "./main-menu-entry/main-menu-entry.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { HomePageRegistrationBannerComponent } from "./home-page-registration-banner/home-page-registration-banner.component";
import { NewUserComponent } from "./new-user/new-user.component";
import { PaymentSubjectFormComponent } from "./payment-subject-form/payment-subject-form.component";
@NgModule({
  declarations: [
    AppComponent,
    PaymentsTimelineComponent,
    MainNavComponent,
    PaymentFormComponent,
    PaymentTimelineEntryComponent,
    NewPaymentComponent,
    TotalPaymentEntryComponent,
    MoneyAmountComponent,
    PaymentSubjectComponent,
    MemberPaymentTimelineComponent,
    MainMenuComponent,
    PageNotFoundComponent,
    MainMenuEntryComponent,
    HomePageComponent,
    HomePageRegistrationBannerComponent,
    NewUserComponent,
    PaymentSubjectFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MglTimelineModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatMenuModule
  ],
  providers: [
    PaymentsService,
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: "ru-RU" }
  ],
  entryComponents: [PaymentFormComponent, PaymentSubjectFormComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
