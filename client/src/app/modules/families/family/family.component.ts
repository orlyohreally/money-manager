import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FamiliesService } from '../services/families/families.service';
import { NotificationsService } from 'src/app/core/services/notifications/notifications.service';
import { FormGroup } from '@angular/forms';
import { MemberFamily } from '../../shared/types/member-family';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../shared/types/confirmation-dialog-data';

@Component({
  selector: 'app-family',
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
  displayNameEditor: boolean = false;

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
          console.log(family);
          this.family.icon = family.icon;
          this.notificationsService.showNotification('Icon has been updated');
        },
        error => {
          console.log(error);
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
          console.log(error);
        }
      );
  }

  removeFamily() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: <ConfirmationDialogData>{
        title: 'Delete family',
        message: `Are you sure you want to remove family ${this.family.name}`,
        okayLabel: 'Yes',
        cancelLabel: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.familiesService.removeFamily(this.family).subscribe(
        response => {
          console.log(response);
          this.notificationsService.showNotification('Family has been removed');
          this.router.navigate(['/families']);
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  private getFamily(familyId: string): void {
    this.family = null;
    this.familiesService.getFamily(familyId).subscribe(
      family => {
        this.family = family;
        console.log(this.family);
        this.familiesService.setCurrentFamily(familyId);
      },
      error => {
        this.router.navigate(['/not-found']);
        console.log(error);
      }
    );
  }
}
