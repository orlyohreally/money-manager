import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import { FamilyMember } from '@shared/types';
import { MemberRole } from '@src/app/types';

@Component({
  selector: 'family-member-card',
  templateUrl: './family-member-card.component.html',
  styleUrls: ['./family-member-card.component.scss'],
  host: { class: 'card' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilyMemberCardComponent implements OnInit {
  @Input() member: FamilyMember;
  @Input() roles: { [roleName: string]: MemberRole };

  constructor() {}

  ngOnInit() {}
}
