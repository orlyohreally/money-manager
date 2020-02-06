import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MemberFamily } from '@shared-client/types/member-family';
// tslint:disable-next-line: max-line-length
import { EditFamilyFormComponent } from '../../edit-family-form/edit-family-form.component';

@Directive({
  selector: '[familyEditFamily]'
})
export class EditFamilyDialogTriggerDirective {
  @Input() familyEditFamily: MemberFamily;

  @HostListener('click', ['$event']) onClick() {
    this.editFamily();
  }

  constructor(private dialog: MatDialog) {}

  editFamily() {
    this.dialog.open(EditFamilyFormComponent, {
      width: '60%',
      maxHeight: '80%',
      maxWidth: '700px',
      minWidth: '300px',
      restoreFocus: false,
      data: this.familyEditFamily,
      panelClass: 'dialog_scrollable'
    });
  }
}
