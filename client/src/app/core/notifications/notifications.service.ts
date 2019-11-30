import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private readonly defaultDuration = 300;

  constructor(private snackBar: MatSnackBar) {}

  showNotification(message: string) {
    this.snackBar.open(message, null, { duration: this.defaultDuration });
  }
}
