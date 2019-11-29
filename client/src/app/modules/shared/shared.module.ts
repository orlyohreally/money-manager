import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ImageCropperModule } from 'ngx-image-cropper';
import {
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { FilterPipe } from './pipes/filter.pipe';

import { ButtonComponent } from './components/button/button.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { HtmlElementSelectComponent } from './components/html-element-select/html-element-select.component';
import { AccordionComponent } from '../shared/components/accordion/accordion.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuEntryComponent } from './components/menu/menu-entry/menu-entry.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageComponent } from './components/image/image.component';
import { ImageManagerComponent } from './components/image-manager/image-manager.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { ImageWithPreviewComponent } from './components/image-with-preview/image-with-preview.component';
import { BadgeDirective } from './directives/badge.directive';

@NgModule({
  declarations: [
    FilterPipe,

    HtmlElementSelectComponent,
    FormFieldComponent,
    ButtonComponent,
    MenuEntryComponent,
    MenuComponent,
    AccordionComponent,
    ImageComponent,
    ImageManagerComponent,
    ImagePreviewComponent,
    ImageWithPreviewComponent,
    BadgeDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,

    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ImageCropperModule
  ],
  exports: [
    FilterPipe,

    FormFieldComponent,
    ButtonComponent,
    HtmlElementSelectComponent,
    MenuComponent,
    AccordionComponent,
    ImageComponent,
    ImageManagerComponent,
    ImageWithPreviewComponent,
    BadgeDirective
  ],
  providers: [],
  entryComponents: [ImageManagerComponent, ImagePreviewComponent]
})
export class SharedModule {}
