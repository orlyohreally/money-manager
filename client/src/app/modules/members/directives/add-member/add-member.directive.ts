import { Directive, HostListener, Input } from '@angular/core';

import { DialogService } from '@core-client/services/dialog/dialog.service';
// tslint:disable-next-line: max-line-length
import { NewFamilyMemberFormComponent } from '../../components/new-member-form/new-member-form.component';

@Directive({
  selector: '[familyAddMember]'
})
export class AddMemberDirective {
  @Input() familyAddMember: string;

  constructor(private dialog: DialogService) {}

  @HostListener('click', ['$event']) onClick() {
    this.addMember();
  }

  addMember() {
    this.dialog.open(NewFamilyMemberFormComponent, {
      width: '1000px',
      maxWidth: '80%',
      height: '80%',
      maxHeight: '1000px',
      data: { family: this.familyAddMember }
    });
  }
}
