import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { ConfirmationDialogComponent } from '@shared-client/components/confirmation-dialog/confirmation-dialog.component';
// tslint:disable-next-line: max-line-length
import { ConfirmationDialogData } from '@shared-client/types/confirmation-dialog-data';
import { throwError } from 'rxjs';
import { MemberFamily } from '../../shared/types/member-family';
import { FamiliesService } from '../services/families/families.service';

@Component({
  selector: 'family-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss']
})
export class FamilyComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familiesService: FamiliesService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog
  ) {}
  family: { name: string; icon: string; membersCount: number };
  displayNameEditor = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const familyId = params.get('familyId');
      this.getFamily(familyId);
    });
  }

  familyIconLoaded(iconUrl: string) {
    this.familiesService
      .updateFamily({ ...this.family, icon: iconUrl })
      .subscribe(
        (family: MemberFamily) => {
          this.family.icon = family.icon;
          this.notificationsService.showNotification('Icon has been updated');
        },
        error => {
          // TODO: make s notification or handle in a way
          throwError(error);
        }
      );
  }

  toggleNameEditor() {
    this.displayNameEditor = !this.displayNameEditor;
  }

  updatedFamilyName(newName: string) {
    this.familiesService
      .updateFamily({ ...this.family, name: newName })
      .subscribe(
        (updatedFamily: MemberFamily) => {
          this.displayNameEditor = false;
          this.family.name = updatedFamily.name;
          this.notificationsService.showNotification(
            'Family name has been updated'
          );
        },
        error => {
          // TODO: add handling
          // console.log(error);
        }
      );
  }

  removeFamily() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: 'Delete family',
        message: `Are you sure you want to remove family ${this.family.name}`,
        okayLabel: 'Yes',
        cancelLabel: 'No'
      } as ConfirmationDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.familiesService.removeFamily(this.family).subscribe(
        response => {
          this.notificationsService.showNotification('Family has been removed');
          this.router.navigate(['/families']);
        },
        error => {
          // TODO: add handling
          // console.log(error);
        }
      );
    });
  }

  private getFamily(familyId: string): void {
    this.family = null;
    this.familiesService.getFamily(familyId).subscribe(
      family => {
        this.family = family;
        this.familiesService.setCurrentFamily(familyId);
      },
      error => {
        this.router.navigate(['/not-found']);
      }
    );
  }
}
