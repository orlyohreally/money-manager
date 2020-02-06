import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { MemberFamily } from '@shared-client/types/member-family';

@Component({
  selector: 'family-family-card',
  templateUrl: './family-card.component.html',
  styleUrls: ['./family-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card' }
})
export class FamilyCardComponent implements OnInit {
  @Input() family: MemberFamily;

  constructor() {}

  ngOnInit() {}
}
