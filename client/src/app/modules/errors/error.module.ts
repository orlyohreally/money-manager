import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';
import { ErrorRoutingModule } from './error-routing.module';
// tslint:disable-next-line: max-line-length
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    ErrorRoutingModule
  ],
  exports: [PageNotFoundComponent]
})
export class ErrorModule {}
