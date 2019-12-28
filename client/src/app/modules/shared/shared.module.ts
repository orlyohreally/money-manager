import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { ImageCropperModule } from 'ngx-image-cropper';

import { FilterPipe } from './pipes/filter.pipe';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line: max-line-length
import { AccordionComponent } from '../shared/components/accordion/accordion.component';
import { ButtonComponent } from './components/button/button.component';
// tslint:disable-next-line: max-line-length
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
// tslint:disable-next-line: max-line-length
import { ErrorMessageComponent } from './components/error-message/error-message.component';
// tslint:disable-next-line: max-line-length
import { FormFieldComponent } from './components/form-field/form-field.component';
// tslint:disable-next-line: max-line-length
import { HtmlElementSelectComponent } from './components/html-element-select/html-element-select.component';
// tslint:disable-next-line: max-line-length
import { ImageManagerComponent } from './components/image-manager/image-manager.component';
// tslint:disable-next-line: max-line-length
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
// tslint:disable-next-line: max-line-length
import { ImageWithPreviewComponent } from './components/image-with-preview/image-with-preview.component';
import { ImageComponent } from './components/image/image.component';
// tslint:disable-next-line: max-line-length
import { MenuEntryComponent } from './components/menu/menu-entry/menu-entry.component';
import { MenuComponent } from './components/menu/menu.component';
// tslint:disable-next-line: max-line-length
import { ValueEditorComponent } from './components/value-editor/value-editor.component';
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
    BadgeDirective,
    ValueEditorComponent,
    ConfirmationDialogComponent,
    ErrorMessageComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,

    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
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
    BadgeDirective,
    ValueEditorComponent,
    ConfirmationDialogComponent,
    ErrorMessageComponent
  ],
  providers: [],
  entryComponents: [
    ImageManagerComponent,
    ImagePreviewComponent,
    ConfirmationDialogComponent
  ]
})
export class SharedModule {}
