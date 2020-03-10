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
import { ContentWithLoaderComponent } from './components/content-with-loader/content-with-loader.component';
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
// tslint:disable-next-line: max-line-length
import { ValueEditorComponent } from './components/value-editor/value-editor.component';
import { BadgeDirective } from './directives/badge.directive';
// tslint:disable-next-line: max-line-length
import { ColoredNumberDirective } from './directives/colored-number/colored-number.directive';
// tslint:disable-next-line: max-line-length
import { NotificationBlockDirective } from './directives/notification-block.directive';
// tslint:disable-next-line: max-line-length
import { ScrollableContentDirective } from './directives/scrollable-content.directive';
// tslint:disable-next-line: max-line-length
import { BypassSecurityTrustUrlPipe } from './pipes/bypass-security-trust-url.pipe';
import { CurrencySymbolPipe } from './pipes/currency-symbol.pipe';
import { FamilyIconPipe } from './pipes/family-icon.pipe';
import { FamilyMemberIconPipe } from './pipes/family-member-icon.pipe';
import { PrefixedNumberPipe } from './pipes/prefixed-number.pipe';
import { UserFullNamePipe } from './pipes/user-full-name.pipe';

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
    LoaderComponent,
    AvatarComponent,
    FamilyIconPipe,
    FamilyMemberIconPipe,
    CurrencySelectorComponent,
    FormComponent,
    CurrencySymbolPipe,
    NotificationBlockDirective,
    PrefixedNumberPipe,
    ScrollableContentDirective,
    ContentWithLoaderComponent,
    ColoredNumberDirective,
    UserFullNamePipe,
    BypassSecurityTrustUrlPipe
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
    LoaderComponent,
    CheckListModule,
    AvatarComponent,
    FamilyIconPipe,
    FamilyMemberIconPipe,
    CurrencySelectorComponent,
    FormComponent,
    CurrencySymbolPipe,
    NotificationBlockDirective,
    PrefixedNumberPipe,
    ScrollableContentDirective,
    ContentWithLoaderComponent,
    ColoredNumberDirective,
    UserFullNamePipe,
    BypassSecurityTrustUrlPipe
  ],
  providers: [CurrencySymbolPipe],
  entryComponents: [
    ImageManagerComponent,
    ImagePreviewComponent,
    ConfirmationDialogComponent
  ]
})
export class SharedModule {}
