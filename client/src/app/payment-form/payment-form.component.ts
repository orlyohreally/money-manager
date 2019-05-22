import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { PaymentsService } from "../payments.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PaymentSubjectsService } from "../payment-subjects.service";
import { AuthenticationService } from "../authentication.service";
import { Payment, PaymentSubject, User as Member } from "@shared/types";
import { PaymentSubjectFormComponent } from "../payment-subject-form/payment-subject-form.component";
import { normalizedArray } from "@shared/utils";

@Component({
  selector: "app-payment-form",
  templateUrl: "./payment-form.component.html",
  styleUrls: ["./payment-form.component.scss"]
})
export class PaymentFormComponent implements OnInit {
  public paymentForm: FormGroup;
  public currentMember: Member;
  public paymentSubjects: normalizedArray<PaymentSubject>;
  constructor(
    public dialogRef: MatDialogRef<PaymentFormComponent>,
    private paymentsService: PaymentsService,
    private authenticationService: AuthenticationService,
    private paymentSubjectsService: PaymentSubjectsService,
    private paymentSubjectForm: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Payment
  ) {}

  private getPaymentSubjects() {
    this.paymentSubjectsService.getSubjects().subscribe(
      subjects => {
        this.paymentSubjects = subjects;
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
    this.currentMember = this.authenticationService.getUser();
    this.getPaymentSubjects();
    if (!this.data) {
      this.initPaymentForm({
        _id: null,
        memberId: this.currentMember._id,
        familyId: "1",
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
        Validators.pattern("^[0-9]*")
      ])
      //receipt: new FormControl(payment.receipt, [])
    });
  }
  get _id() {
    return this.paymentForm.get("_id");
  }
  get memberId() {
    return this.paymentForm.get("memberId");
  }

  get paidAt() {
    return this.paymentForm.get("paidAt");
  }

  get subjectId() {
    return this.paymentForm.get("subjectId");
  }
  public newPaymentSubject(event) {
    event.stopPropagation();
    this.openPaymentSubjectForm();
  }
  public openPaymentSubjectForm(): void {
    const dialogRef = this.paymentSubjectForm.open(
      PaymentSubjectFormComponent,
      {
        width: "400px",
        restoreFocus: false
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentForm.controls.subjectId.setValue(result._id);
      }
    });
  }
  public savePayment() {
    console.log(this.paymentForm.valid);
    if (this.paymentForm.valid) {
      if (!this.paymentForm.value._id) {
        this.createPayment();
      } else {
        this.updatePayment();
      }
    } else {
      this.paymentForm.markAsTouched();
    }
  }
  private updatePayment() {
    this.paymentsService.updatePayment(this.paymentForm.value).subscribe(
      result => {
        this.dialogRef.close(result);
      },
      error => {
        console.log(error);
      }
    );
  }

  private createPayment() {
    this.paymentsService.createPayment(this.paymentForm.value).subscribe(
      result => {
        this.dialogRef.close(result);
      },
      error => {
        console.log(error);
      }
    );
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
