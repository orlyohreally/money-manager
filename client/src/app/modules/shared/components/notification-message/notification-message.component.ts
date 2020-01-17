import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'shared-notification-message',
  templateUrl: './notification-message.component.html',
  styleUrls: ['./notification-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationMessageComponent implements OnInit {
  @Input() type: 'success' | 'info' | 'error';

  defaultType = 'info';

  constructor() {}

  ngOnInit() {}
}
