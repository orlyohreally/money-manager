import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'payment-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  @HostBinding('style.width') width = '100%';

  @Input() payments: {
    amount: number;
    paidAt: string;
    createdAt: string;
    memberFullName: string;
    updatedAt: string;
    subjectName: string;
    subjectIcon: string;
    currency: string;
  }[];

  displayedColumns: string[] = [
    'subject',
    'amount',
    'memberFullName',
    'paidAt',
    'createdAt',
    'updatedAt'
  ];

  constructor() {}

  ngOnInit() {}
}
