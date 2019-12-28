import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule, MatSidenavModule } from '@angular/material';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
// tslint:disable-next-line: max-line-length
import { ServerErrorInterceptor } from './core/interceptors/server-error.interceptor';
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
