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
  public currentMember: Member;
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
        this.paymentSubjects.push({
          _id: '0',
          icon: 'assets/payment-subjects-icons/new.png',
          familyId: '1',
          name: 'Other'
        });
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
    this.currentMember = this.authenticationService.getMember();
    this.getPaymentSubjects();
    if (!this.data) {
      this.initPaymentForm({
        _id: null,
        memberId: this.currentMember._id,
        familyId: '1',
        paidAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        subjectId: null,
        amount: 0
      });
    } else {
      this.initPaymentForm(this.data);
    }
  }
  initPaymentForm(payment: Payment) {
    this.paymentForm = new FormGroup({
      _id: new FormControl(payment._id),
      memberId: new FormControl(payment.memberId, [Validators.required]),
      paidAt: new FormControl(payment.paidAt, [Validators.required]),
      subjectId: new FormControl(payment.subjectId, [Validators.required]),
      amount: new FormControl(payment.amount, [
        Validators.required,
        Validators.pattern('^[0-9]*')
      ]),
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
  get _id() {
    return this.paymentForm.get('_id');
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
      if (!this.paymentForm.value._id) {
        this.paymentsService.createPayment(this.paymentForm.value);
        this.dialogRef.close(this.paymentForm.value);
      } else {
        this.paymentsService.updatePayment(this.paymentForm.value).subscribe(
          result => {
            this.dialogRef.close(result);
          },
          error => {
            console.log(error);
          }
        );
      }
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
