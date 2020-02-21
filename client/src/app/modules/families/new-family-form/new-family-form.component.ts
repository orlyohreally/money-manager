import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
import { MemberFamily } from '../../shared/types';

@Component({
  selector: 'family-new-family-form',
  templateUrl: './new-family-form.component.html',
  styleUrls: ['./new-family-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewFamilyFormComponent implements OnInit {
  @Input() form: FormGroup;

  memberRoles: string[];

  constructor(
    private dialogRef: MatDialogRef<NewFamilyFormComponent>,
    private familiesService: FamiliesService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      icon: new FormControl(''),
      currency: new FormControl(''),
      equalPayments: new FormControl(true)
    });
  }

  submitForm() {
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.createFamily(this.form.value);
  }

  onRolesUpdated(roles: string[]) {
    this.memberRoles = roles;
  }

  private createFamily(family: MemberFamily) {
    this.familiesService.createFamily(family, this.memberRoles).subscribe(
      (response: MemberFamily) => {
        this.dialogRef.close();
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
