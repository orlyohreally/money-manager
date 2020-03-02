import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
import { PaymentView } from '@shared/types';
import { FamilyPaymentView } from '@src/app/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  payments: Observable<FamilyPaymentView[]>;

  displayedColumns: string[] = [
    'subject',
    'amount',
    'memberFullName',
    'paidAt',
    'createdAt',
    'updatedAt',
    'actions'
  ];

  familyId: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private paymentsService: PaymentsService,
    private userManagerService: UserManagerService
  ) {}

  ngOnInit() {
    this.familyId = this.route.parent.paramMap.pipe(
      map((params: ParamMap) => {
        const familyId = params.get('familyId');
        this.getPayments(familyId);
        return familyId;
      })
    );
  }

  private getPayments(familyId?: string) {
    this.payments = this.paymentsService.getAggregatedPayments(familyId).pipe(
      map((payments: PaymentView[]) =>
        payments.map((payment: PaymentView) => {
          return {
            amount: payment.amount,
            paidAt: payment.paidAt.toString(),
            createdAt: payment.createdAt.toString(),
            memberFullName: this.userManagerService.getFullName(payment.user),
            memberEmail: payment.user.email,
            updatedAt: payment.updatedAt.toString(),
            subjectName: payment.subject ? payment.subject.name : '',
            subjectIcon: payment.subject ? payment.subject.icon : '',
            currency: payment.currency
          };
        })
      )
    );
  }

  // private calculateTotal() {
  //   this.paymentAmounts = aggregateAmountsByMember(
  //     this.payments,
  //     this.payers.map(member => member._id)
  //   );
  //   this.paymentAmounts.sum = getTotalPaymentAmount(
  //     unnormalizeArray(this.payments)
  //   );
  // }
  // public calcDischargedTotal() {
  //   this.paymentAmounts = {};
  //   this.paymentAmounts = getDischargedTotal(
  //     this.payments,
  //     this.payers.map(member => member._id)
  //   );
  //   this.paymentAmounts.sum = getTotalPaymentAmount(
  //     unnormalizeArray(this.payments)
  //   );
  // }

  // public editPayment(payment: Payment) {
  //   this.openForm(payment);
  // }
  // public openForm(payment: Payment): void {
  //   const dialogRef = this.paymentForm.open(PaymentFormComponent, {
  //     width: '300px',
  //     restoreFocus: false,
  //     data: payment
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.calculateTotal();
  //   });
  // }
  // public removePayment(payment: Payment) {
  //   this.paymentsService.removePayment(payment).subscribe(
  //     result => {
  //       if (result.status === 'success') {
  //         this.snackBar.open(
  // tslint:disable-next-line: max-line-length
  //           `Payment for ₪ ${payment.amount} by ${payment.memberId} was deleted`,
  //           null,
  //           {
  //             duration: 2000
  //           }
  //         );

  //         this.calculateTotal();
  //       } else {
  //         this.snackBar.open(result.msg, null, {
  //           duration: 2000
  //         });
  //       }
  //     },
  //     error => {
  //       // TODO: add handling
  //       // console.log(error);
  //     }
  //   );
  // }
}
