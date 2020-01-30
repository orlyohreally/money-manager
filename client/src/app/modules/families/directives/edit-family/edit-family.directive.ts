import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
import { MemberFamily } from '@shared-client/types/member-family';
import { FamilyFormComponent } from '../../family-form/family-form.component';

@Directive({
  selector: '[familyEditFamily]'
})
export class EditFamilyDirective {
  @Input() familyEditFamily: MemberFamily;

  @HostListener('click', ['$event']) onClick() {
    this.editFamily();
  }

  constructor(
    private dialog: MatDialog,
    private familiesService: FamiliesService,
    private notificationsService: NotificationsService
  ) {}

  editFamily() {
    const dialogRef = this.dialog.open(FamilyFormComponent, {
      width: '300px',
      restoreFocus: false,
      data: this.familyEditFamily
    });

    dialogRef.afterClosed().subscribe((family: MemberFamily) => {
      if (!family) {
        return;
      }
      this.updateFamily({ ...family, _id: this.familyEditFamily._id });
    });
  }

  private updateFamily(family: MemberFamily) {
    this.familiesService.updateFamily(family).subscribe(
      () => {
        this.notificationsService.showNotification(
          'Family has been successfully created'
        );
      },
      error => {
        this.notificationsService.showNotification('Server Error');
      }
    );
  }
}
