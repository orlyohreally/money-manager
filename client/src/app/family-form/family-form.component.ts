import { Component, OnInit, Input, Inject } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Family } from "@shared/types";

@Component({
  selector: "app-family-form",
  templateUrl: "./family-form.component.html",
  styleUrls: ["./family-form.component.scss"]
})
export class FamilyFormComponent implements OnInit {
  public familyForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<FamilyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Family
  ) {}

  public cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (!this.data) {
      this.initFamilyForm({
        _id: null,
        name: null
      });
    } else {
      this.initFamilyForm(this.data);
    }
  }

  initFamilyForm(family: Family) {
    this.familyForm = new FormGroup({
      _id: new FormControl(family._id),
      name: new FormControl(family.name, [Validators.required])
    });
  }

  get _id() {
    return this.familyForm.get("_id");
  }

  get name() {
    return this.familyForm.get("name");
  }

  public saveFamily() {
    console.log(this.familyForm.valid);
    if (this.familyForm.valid) {
      if (!this.familyForm.value._id) {
        this.createPayment();
      } else {
        this.updatePayment();
      }
    } else {
      this.familyForm.markAsTouched();
    }
  }
  private updatePayment() {
    console.log("update", this.familyForm.value);

    // this.paymentsService.updatePayment(this.familyForm.value).subscribe(
    //   result => {
    //     this.dialogRef.close(result);
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }

  private createPayment() {
    console.log("create", this.familyForm.value);
    // this.paymentsService.createPayment(this.familyForm.value).subscribe(
    //   result => {
    //     this.dialogRef.close(result);
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }
}
