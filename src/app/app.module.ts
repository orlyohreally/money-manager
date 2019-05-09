import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MglTimelineModule } from "angular-mgl-timeline";
import { AppRoutingModule } from "./app-routing.module";
import {
  MatSnackBarModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule
} from "@angular/material";
import { AppComponent } from "./app.component";
import { PaymentsComponent } from "./payments/payments.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
@NgModule({
  declarations: [AppComponent, PaymentsComponent, MainNavComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MglTimelineModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule
  ],
  providers: [],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
