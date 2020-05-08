import { Directive, HostBinding, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[sharedNotificationBlock]'
})
export class NotificationBlockDirective implements OnChanges {
  @HostBinding('class') classes: string;

  @Input('sharedNotificationBlock') type: 'success' | 'info' | 'error';

  defaultType = 'info';

  constructor() {}

  ngOnChanges(): void {
    this.classes = `notification-message notification-message_${this.type ||
      this.defaultType}`;
  }
}
