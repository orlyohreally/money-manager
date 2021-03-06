import { OverlayContainer } from '@angular/cdk/overlay';
import { CurrencyPipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// tslint:disable-next-line: max-line-length
import { ServerErrorInterceptor } from '@core-client/interceptors/server-error.interceptor';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { DataService } from './core/services/data.service';
import { FamilyModule } from './modules/families/family.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { UserModule } from './modules/user/user.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatProgressBarModule,
    NgxLocalStorageModule.forRoot(),

    NavigationModule,
    FamilyModule,
    UserModule
  ],
  providers: [
    DataService,
    CurrencyPipe,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer
      .getContainerElement()
      .classList.add('light-theme', 'mat-typography');
  }
}
