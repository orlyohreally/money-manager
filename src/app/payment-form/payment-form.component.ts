import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Payment } from '@shared/types/payment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PaymentsService } from '../payments.service';
import { AuthenticationService } from '../authentication.service';
import { Member } from '@shared/types/member';
import { PaymentSubject } from '@shared/types/payment-subject';
import { PaymentSubjectsService } from '../payment-subjects.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {
  public paymentForm: FormGroup;
  public member: Member;
  public paymentSubjects: PaymentSubject[];
  public otherSubject = false;
  constructor(
    public dialogRef: MatDialogRef<PaymentFormComponent>,
    private paymentsService: PaymentsService,
    private authenticationService: AuthenticationService,
    private paymentSubjectsService: PaymentSubjectsService,
    @Inject(MAT_DIALOG_DATA) public data: Payment
  ) {}

  private getPaymentSubjects() {
    this.paymentSubjectsService.get().subscribe(
      subjects => {
        console.log(subjects);
        this.paymentSubjects = subjects;
        // this.paymentSubjects.push({ _id: '0', familyId: '1', name: 'Other' });
      },
      error => {
        console.log(error);
      }
    );
  }
  public cancel(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.member = this.authenticationService.getMember();
    this.getPaymentSubjects();
    if (!this.data) {
      let payment: Payment;
      this.initPaymentForm(payment);
    } else {
      this.initPaymentForm(this.data);
    }
  }
  initPaymentForm(payment: Payment) {
    this.paymentForm = new FormGroup({
      memberId: new FormControl(payment.memberId, [Validators.required]),
      paidAt: new FormControl(payment.paidAt, [Validators.required]),
      subjectId: new FormControl(payment.subjectId, [Validators.required]),
      amount: new FormControl(payment.amount, [Validators.required]),
      newSubject: new FormControl('', []),
      receipt: new FormControl(payment.receipt, [])
    });

    this.paymentForm.get('subjectId').valueChanges.subscribe(value => {
      this.otherSubject = value === '0';
      if (this.otherSubject) {
        this.paymentForm.controls.newSubject.setValidators([
          Validators.required
        ]);
      } else {
        this.paymentForm.controls.newSubject.setValidators([]);
      }
      this.paymentForm.controls.newSubject.updateValueAndValidity();
    });
  }
  get memberId() {
    return this.paymentForm.get('memberId');
  }

  get paidAt() {
    return this.paymentForm.get('paidAt');
  }

  get subjectId() {
    return this.paymentForm.get('subjectId');
  }

  get newSubject() {
    return this.paymentForm.get('newSubject');
  }

  public savePayment() {
    if (this.paymentForm.valid) {
      this.paymentsService.updatePayment(this.paymentForm.value).subscribe(
        savedPayment => {
          this.dialogRef.close(savedPayment);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  public onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.paymentForm.patchValue({
          receipt: reader.result
        });
      };
    }
  }
}
