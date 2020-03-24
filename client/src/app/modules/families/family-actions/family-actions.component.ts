import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FamilyView } from '@shared/types';

@Component({
  selector: 'family-actions',
  templateUrl: './family-actions.component.html',
  styleUrls: ['./family-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilyActionsComponent implements OnInit {
  @Input() familyInfo: FamilyView & { _id: string };

  constructor() {}

  ngOnInit() {}
}
