import { Component, Input, OnInit } from '@angular/core';
import { MemberRole } from '@src/app/types';

@Component({
  selector: 'family-member-card',
  templateUrl: './family-member-card.component.html',
  styleUrls: ['./family-member-card.component.scss'],
  host: { class: 'card' }
})
export class FamilyMemberCardComponent implements OnInit {
  @Input() member: {
    fullName: string;
    roles: string[];
    icon: string;
    email: string;
  };
  @Input() roles: { [roleName: string]: MemberRole };

  constructor() {}

  ngOnInit() {}
}
