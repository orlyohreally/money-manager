import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  RECAPTCHA_SETTINGS,
  RecaptchaFormsModule,
  RecaptchaModule,
  RecaptchaSettings
} from 'ng-recaptcha';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { FilterPipe } from './pipes/filter.pipe';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line: max-line-length
import { AccordionComponent } from '../shared/components/accordion/accordion.component';
import { CheckListModule } from './check-list/check-list.module';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ButtonComponent } from './components/button/button.component';
// tslint:disable-next-line: max-line-length
import { CloseDialogButtonComponent } from './components/close-dialog-button/close-dialog-button.component';
// tslint:disable-next-line: max-line-length
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
// tslint:disable-next-line: max-line-length
import { ContactFormComponent } from './components/contact-form/contact-form.component';
// tslint:disable-next-line: max-line-length
import { ContentWithLoaderComponent } from './components/content-with-loader/content-with-loader.component';
// tslint:disable-next-line: max-line-length
import { CurrencySelectorComponent } from './components/currency-selector/currency-selector.component';
// tslint:disable-next-line: max-line-length
import { DateSelectorComponent } from './components/date-selector/date-selector.component';
// tslint:disable-next-line: max-line-length
import { DatetimeSelectorComponent } from './components/datetime-selector/datetime-selector.component';
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
import { MemberSelectorComponent } from './components/member-selector/member-selector.component';
// tslint:disable-next-line: max-line-length
import { MenuEntryComponent } from './components/menu/menu-entry/menu-entry.component';
import { MenuComponent } from './components/menu/menu.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectSelectorComponent } from './components/payment-subject-selector/payment-subject-selector.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectComponent } from './components/payment-subject/payment-subject.component';
// tslint:disable-next-line: max-line-length
import { ValueEditorComponent } from './components/value-editor/value-editor.component';
// tslint:disable-next-line: max-line-length
import { BackgroundColorDirective } from './directives/background-color/background-color.directive';
import { BadgeDirective } from './directives/badge.directive';
// tslint:disable-next-line: max-line-length
import { ColoredNumberDirective } from './directives/colored-number/colored-number.directive';
// tslint:disable-next-line: max-line-length
import { DynamicActiveRouterLinkDirective } from './directives/dynamic-active-router-link/dynamic-active-router-link.directive';
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
import { SortByPipe } from './pipes/sort-by.pipe';
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
    BypassSecurityTrustUrlPipe,
    MemberSelectorComponent,
    PaymentSubjectSelectorComponent,
    PaymentSubjectComponent,
    DateSelectorComponent,
    DatetimeSelectorComponent,
    SortByPipe,
    DynamicActiveRouterLinkDirective,
    BackgroundColorDirective,
    CloseDialogButtonComponent,
    ContactFormComponent
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
    NgxMatSelectSearchModule,
    CheckListModule,
    MatDatepickerModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatTooltipModule,
    RecaptchaModule,
    RecaptchaFormsModule
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
    MemberSelectorComponent,
    UserFullNamePipe,
    BypassSecurityTrustUrlPipe,
    PaymentSubjectSelectorComponent,
    PaymentSubjectComponent,
    DateSelectorComponent,
    DatetimeSelectorComponent,
    CloseDialogButtonComponent,
    SortByPipe,
    DynamicActiveRouterLinkDirective,
    ContactFormComponent
  ],
  providers: [
    CurrencySymbolPipe,
    DecimalPipe,
    UserFullNamePipe,
    { provide: 'windowObj', useValue: window },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LciOKsZAAAAAMlT8x8m6hlzA61QCCvAEN0M8Eu5'
      } as RecaptchaSettings
    }
  ],
  entryComponents: [
    ImageManagerComponent,
    ImagePreviewComponent,
    ConfirmationDialogComponent
  ]
})
export class SharedModule {}
