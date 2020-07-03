import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

import { NotificationType } from '@src/app/types';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private readonly defaultDuration = 300;

  constructor(private snackBar: MatSnackBar) {}

  showNotification<T>(
    message: string,
    type: NotificationType = NotificationType.Success,
    params?: MatSnackBarConfig<T>
  ): MatSnackBarRef<SimpleSnackBar> {
    const config = this.setConfig<T>(params, type);
    return this.snackBar.open(message, null, config);
  }

  private setConfig<T>(params: MatSnackBarConfig<T>, type: string) {
    const notificationClass = `notification_${type}`;
    let panelClass: string[];
    if (!params || !params.panelClass) {
      panelClass = [notificationClass];
    } else if (typeof params.panelClass === 'string') {
      panelClass = [params.panelClass, notificationClass];
    } else {
      panelClass = [...params.panelClass, notificationClass];
    }
    const config = {
      ...params,
      panelClass,
      ...((!params || !params.duration) && { duration: this.defaultDuration })
    };
    return config;
  }
}
