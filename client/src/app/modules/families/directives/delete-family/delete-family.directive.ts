import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { ConfirmationDialogComponent } from '@shared-client/components/confirmation-dialog/confirmation-dialog.component';
// tslint:disable-next-line: max-line-length
import { ConfirmationDialogData } from '@shared-client/types/confirmation-dialog-data';
import { MemberFamily } from '@shared-client/types/member-family';
import { DialogService } from '@src/app/core/services/dialog/dialog.service';

@Directive({
  selector: '[familyDeleteFamily]'
})
export class DeleteFamilyDirective {
  @Input() familyDeleteFamily: MemberFamily;

  @HostListener('click', ['$event']) onClick() {
    this.deleteFamily();
  }

  constructor(
    private dialog: DialogService,
    private familiesService: FamiliesService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  deleteFamily() {
    const dialogRef = this.dialog.open(
      ConfirmationDialogComponent,
      {
        width: '250px',
        data: {
          title: `Delete family ${this.familyDeleteFamily.name}?`,
          okayLabel: 'Yes',
          cancelLabel: 'No'
        } as ConfirmationDialogData
      },
      false
    );

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.familiesService.removeFamily(this.familyDeleteFamily).subscribe(
        () => {
          this.notificationsService.showNotification('Family has been removed');
          this.router.navigate(['/user/families']);
        },
        error => {
          this.notificationsService.showNotification('Server Error');
        }
      );
    });
  }
}
