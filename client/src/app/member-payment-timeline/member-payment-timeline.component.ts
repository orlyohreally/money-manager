import { Component, OnInit, Input } from '@angular/core';
import { User as Member } from '@shared/types';

@Component({
  selector: 'app-member-payment-timeline',
  templateUrl: './member-payment-timeline.component.html',
  styleUrls: ['./member-payment-timeline.component.scss']
})
export class MemberPaymentTimelineComponent implements OnInit {
  @Input() member: Member;
  constructor() {}

  ngOnInit() {}
}
