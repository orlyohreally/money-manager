import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
import { User } from '@shared/types';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@src/app/core/services/user-manager/user-manager.service';
import { NotificationType } from '@src/app/types';

@Component({
  selector: 'user-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  user: Observable<User>;
  errorMessage: string;

  constructor(
    private authenticationService: AuthenticationService,
    private userManagerService: UserManagerService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.user = this.authenticationService.getUser();
  }

  onFormSubmitted(user: User) {
    this.userManagerService.updateUser(user).subscribe(
      () => {
        this.notificationsService.showNotification(
          'User information has been successfully updated',
          NotificationType.Success,
          { duration: 1000 }
        );
      },
      () => {
        this.errorMessage = 'Server error';
      }
    );
  }
}
