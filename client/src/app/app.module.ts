import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatSidenavModule, MatProgressBarModule } from '@angular/material';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { NavigationModule } from './modules/navigation/navigation.module';
import { FamilyModule } from './modules/families/family.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ServerErrorInterceptor } from './core/interceptors/server-error.interceptor';
import { AuthenticationService } from './core/services/authentication/authentication.service';
import { DataService } from './core/services/data.service';

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
