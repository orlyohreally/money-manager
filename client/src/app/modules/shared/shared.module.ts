import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  MatButtonModule,
  MatMenuModule,
  MatIconModule
} from "@angular/material";

import { ButtonComponent } from "./components/button/button.component";
import { FormFieldComponent } from "./components/form-field/form-field.component";
import { HtmlElementSelectComponent } from "./components/html-element-select/html-element-select.component";

import { FilterPipe } from "./pipes/filter.pipe";
import { MenuComponent } from "./components/menu/menu.component";
import { MenuEntryComponent } from "./components/menu/menu-entry/menu-entry.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    HtmlElementSelectComponent,
    FormFieldComponent,
    ButtonComponent,
    MenuEntryComponent,
    MenuComponent,

    FilterPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,

    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  exports: [
    FormFieldComponent,
    ButtonComponent,
    HtmlElementSelectComponent,
    MenuComponent,

    FilterPipe
  ],
  providers: []
})
export class SharedModule {}
