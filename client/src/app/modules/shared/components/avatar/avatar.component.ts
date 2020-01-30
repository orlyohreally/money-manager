import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'shared-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent implements OnInit {
  @Input() avatarUrl: string;
  @Input() avatarSize: string;

  defaultAvatarSize = '100px';

  constructor() {}

  ngOnInit() {}

  getStyles() {
    return {
      height: this.avatarSize || this.defaultAvatarSize,
      width: this.avatarSize || this.defaultAvatarSize,
      'background-image': `url(${this.avatarUrl})`
    };
  }
}
