import { Directive, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
import { MemberFamily } from '@src/app/modules/shared/types/member-family';
import { FamilyFormComponent } from '../../family-form/family-form.component';

@Directive({
  selector: '[familyNewFamily]'
})
export class NewFamilyDirective {
  @HostListener('click', ['$event']) onClick() {
    this.newFamily();
  }

  constructor(
    private dialog: MatDialog,
    private familiesService: FamiliesService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  newFamily() {
    const dialogRef = this.dialog.open(FamilyFormComponent, {
      width: '300px',
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe((family: MemberFamily) => {
      if (!family) {
        return;
      }
      this.createFamily(family);
    });
  }

  private createFamily(family: MemberFamily) {
    this.familiesService.createFamily(family).subscribe(
      (response: MemberFamily) => {
        this.notificationsService.showNotification(
          'Family has been successfully created'
        );
        this.router.navigate([`/families/${response._id}/dashboard`]);
      },
      () => {
        this.notificationsService.showNotification('Server Error');
      }
    );
  }
}
