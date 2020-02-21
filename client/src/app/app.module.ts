import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule, MatSidenavModule } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { ServerErrorInterceptor } from '@core-client/interceptors/server-error.interceptor';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import 'hammerjs';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { DataService } from './core/services/data.service';
import { FamilyModule } from './modules/families/family.module';
import { NavigationModule } from './modules/navigation/navigation.module';

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
    FamilyModule
  ],
  providers: [
    DataService,
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
export class AppModule {}
