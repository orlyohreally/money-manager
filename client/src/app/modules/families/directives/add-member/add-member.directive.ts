import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Member } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NewFamilyMemberFormComponent } from '@src/app/modules/members/components/member-form/new-family-member-form.component';

@Directive({
  selector: '[familyAddMember]'
})
export class AddMemberDirective {
  @Input() familyAddMember: string;

  constructor(private dialog: MatDialog) {}

  @HostListener('click', ['$event']) onClick() {
    this.addMember();
  }

  addMember() {
    const dialogRef = this.dialog.open(NewFamilyMemberFormComponent, {
      width: '1000px',
      maxWidth: '80%',
      height: '80%',
      restoreFocus: false,
      data: { familyId: this.familyAddMember }
    });

    dialogRef.afterClosed().subscribe((familyMember: Partial<Member>) => {
      if (!familyMember) {
        return;
      }
    });
  }
}
