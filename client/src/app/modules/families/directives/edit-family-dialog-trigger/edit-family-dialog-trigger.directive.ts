import { Directive, HostListener, Input } from '@angular/core';

import { DialogService } from '@core-client/services/dialog/dialog.service';
import { MemberFamily } from '@shared-client/types/member-family';
// tslint:disable-next-line: max-line-length
import { EditFamilyFormComponent } from '../../edit-family-form/edit-family-form.component';

@Directive({
  selector: '[familyEditFamily]'
})
export class EditFamilyDialogTriggerDirective {
  @Input('familyEditFamily') family: MemberFamily;

  @HostListener('click', ['$event']) onClick() {
    this.editFamily();
  }

  constructor(private dialog: DialogService) {}

  editFamily() {
    this.dialog.open(EditFamilyFormComponent, {
      data: this.family
    });
  }
}
