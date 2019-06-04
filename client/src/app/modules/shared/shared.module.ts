import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import {
  MatButtonModule,
  MatMenuModule,
  MatIconModule
} from "@angular/material";

import { FilterPipe } from "./pipes/filter.pipe";

import { ButtonComponent } from "./components/button/button.component";
import { FormFieldComponent } from "./components/form-field/form-field.component";
import { HtmlElementSelectComponent } from "./components/html-element-select/html-element-select.component";
import { AccordionComponent } from "../shared/components/accordion/accordion.component";
import { MenuComponent } from "./components/menu/menu.component";
import { MenuEntryComponent } from "./components/menu/menu-entry/menu-entry.component";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  declarations: [
    HtmlElementSelectComponent,
    FormFieldComponent,
    ButtonComponent,
    MenuEntryComponent,
    MenuComponent,
    AccordionComponent,

    FilterPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,

    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  exports: [
    FormFieldComponent,
    ButtonComponent,
    HtmlElementSelectComponent,
    MenuComponent,
    AccordionComponent,
    FilterPipe
  ],
  providers: []
})
export class SharedModule {}
