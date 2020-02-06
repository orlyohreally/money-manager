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
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material';
import { ImageCropperModule } from 'ngx-image-cropper';

import { FilterPipe } from './pipes/filter.pipe';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line: max-line-length
import { AccordionComponent } from '../shared/components/accordion/accordion.component';
import { CheckListModule } from './check-list/check-list.module';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ButtonComponent } from './components/button/button.component';
// tslint:disable-next-line: max-line-length
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
// tslint:disable-next-line: max-line-length
import { CurrencySelectorComponent } from './components/currency-selector/currency-selector.component';
// tslint:disable-next-line: max-line-length
import { FormFieldComponent } from './components/form-field/form-field.component';
import { FormComponent } from './components/form/form.component';
// tslint:disable-next-line: max-line-length
import { HtmlElementSelectComponent } from './components/html-element-select/html-element-select.component';
// tslint:disable-next-line: max-line-length
import { ImageManagerComponent } from './components/image-manager/image-manager.component';
// tslint:disable-next-line: max-line-length
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
// tslint:disable-next-line: max-line-length
import { ImageWithPreviewComponent } from './components/image-with-preview/image-with-preview.component';
import { ImageComponent } from './components/image/image.component';
import { LoaderComponent } from './components/loader/loader.component';
// tslint:disable-next-line: max-line-length
import { MenuEntryComponent } from './components/menu/menu-entry/menu-entry.component';
import { MenuComponent } from './components/menu/menu.component';
// tslint:disable-next-line: max-line-length
import { NotificationMessageComponent } from './components/notification-message/notification-message.component';
// tslint:disable-next-line: max-line-length
import { ValueEditorComponent } from './components/value-editor/value-editor.component';
import { BadgeDirective } from './directives/badge.directive';
import { FamilyIconPipe } from './pipes/family-icon.pipe';

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
    NotificationMessageComponent,
    LoaderComponent,
    AvatarComponent,
    FamilyIconPipe,
    CurrencySelectorComponent,
    FormComponent
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
    MatSelectModule,
    ImageCropperModule,
    CheckListModule
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
    NotificationMessageComponent,
    LoaderComponent,
    CheckListModule,
    AvatarComponent,
    FamilyIconPipe,
    CurrencySelectorComponent,
    FormComponent
  ],
  providers: [],
  entryComponents: [
    ImageManagerComponent,
    ImagePreviewComponent,
    ConfirmationDialogComponent
  ]
})
export class SharedModule {}
