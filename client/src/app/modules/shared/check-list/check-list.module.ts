import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { CheckboxComponent } from './components/checkbox/checkbox.component';
// tslint:disable-next-line: max-line-length
import { CheckListTitleDirective } from './directives/check-list-title.directive';
import { CheckboxGroupDirective } from './directives/checkbox-group.directive';

@NgModule({
  declarations: [
    CheckboxComponent,
    CheckboxGroupDirective,
    CheckListTitleDirective
  ],
  imports: [CommonModule, FlexLayoutModule, MatCheckboxModule, FormsModule],
  exports: [CheckboxComponent, CheckboxGroupDirective, CheckListTitleDirective]
})
export class CheckListModule {}
