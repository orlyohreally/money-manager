import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";

import { ErrorRoutingModule } from "./error-routing.module";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { MatButtonModule } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

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
