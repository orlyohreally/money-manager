import { Component, OnInit, Input, Inject } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Family } from "@shared/types";
import { FamiliesService } from "@shared-client/services/families/families.service";

@Component({
  selector: "family-family-form",
  templateUrl: "./family-form.component.html",
  styleUrls: ["./family-form.component.scss"]
})
export class FamilyFormComponent implements OnInit {
  public familyForm: FormGroup;
  public error; //TODO: type
  constructor(
    public dialogRef: MatDialogRef<FamilyFormComponent>,
    private familiesService: FamiliesService,
    @Inject(MAT_DIALOG_DATA) public family: Family
  ) {}

  public cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (!this.family) {
      this.familyForm = new FormGroup({
        name: new FormControl("", [Validators.required])
      });
    } else {
      this.familyForm = new FormGroup({
        _id: new FormControl(this.family._id),
        name: new FormControl(this.family.name, [Validators.required])
      });
    }
  }

  get name() {
    return this.familyForm.get("name");
  }

  getErrorMessage(control: string) {
    return this.familyForm.controls[control].hasError("required")
      ? "Value is required"
      : null;
  }

  public updateData(): void {
    if (!this.familyForm.valid) {
      this.familyForm.markAsTouched();
      return;
    }
    if (!this.familyForm.value._id) {
      this.createFamily();
      return;
    }
    this.updateFamily();
  }

  private updateFamily() {
    console.log("update", this.familyForm.value);
    // this.familiesService.update(this.familyForm.value).subscribe(
    //   result => {
    //     this.dialogRef.close(result);
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }

  private createFamily() {
    this.familiesService
      .create(this.familyForm.value)
      .then(res => {
        console.log(res);
        this.dialogRef.close(res);
      })
      .catch(err => {
        console.log(err);
        this.error = err;
      });
  }
}
