import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PaymentSubject, Family, ImageAsset } from "@shared/types";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { normalizedArray } from "@shared/utils";
import { FamiliesService } from "../families.service";
import { PaymentSubjectsService } from "../payment-subjects.service";
import { ImageAssetService } from "../image-asset.service";
import { HtmlElementRepresentation } from "../html-element";

@Component({
  selector: "app-payment-subject-form",
  templateUrl: "./payment-subject-form.component.html",
  styleUrls: ["./payment-subject-form.component.scss"]
})
export class PaymentSubjectFormComponent implements OnInit {
  constructor(
    private familiesService: FamiliesService,
    public dialogRef: MatDialogRef<PaymentSubjectFormComponent>,
    private imageAssetService: ImageAssetService,
    private paymentSubjectsService: PaymentSubjectsService,
    @Inject(MAT_DIALOG_DATA) public data: PaymentSubject
  ) {}
  subjectForm: FormGroup;
  families: normalizedArray<Family>;
  subjectIcons: HtmlElementRepresentation[];
  ngOnInit() {
    this.getFamilies();
    this.getIcons();
    this.initForm(this.data);
  }
  private getIcons() {
    const generateElements = icon => ({
      id: icon.path,
      innerHTML: `<img src="${icon.path}"/>`,
      classes: "subject-icon clickable"
    });

    this.subjectIcons = this.imageAssetService
      .getImageAssetsByCategory("payment-subject")
      .map(generateElements);
  }
  private initForm(subject: Partial<PaymentSubject>) {
    console.log(subject);
    if (!subject) {
      subject = {
        _id: null,
        name: null,
        familyId: null,
        icon: null //this.subjectIcons[0].path
      };
    }

    this.subjectForm = new FormGroup({
      _id: new FormControl(subject._id),
      name: new FormControl(subject.name, [Validators.required]),
      familyId: new FormControl(subject.familyId, [Validators.required]),
      icon: new FormControl(subject.icon, [Validators.required])
    });
  }
  public getErrorMessage() {
    return "You must enter a value";
  }
  get _id() {
    return this.subjectForm.get("_id");
  }

  get name() {
    return this.subjectForm.get("name");
  }

  get familyId() {
    return this.subjectForm.get("familyId");
  }

  get icon() {
    return this.subjectForm.get("icon");
  }

  private getFamilies() {
    this.familiesService.getMemberFamilies().subscribe(
      families => {
        this.families = families;
      },
      error => {
        console.log(error);
      }
    );
  }

  public async saveSubject() {
    if (!this.subjectForm.valid) {
      for (let control in this.subjectForm.controls) {
        this.subjectForm.controls[control].markAsTouched({ onlySelf: true });
      }
    } else {
      if (!this.subjectForm.value._id) {
        await this.paymentSubjectsService.createSubject(this.subjectForm.value);
        this.dialogRef.close(this.subjectForm.value);
      } else {
        await this.paymentSubjectsService.updateSubject(this.subjectForm.value);
        this.dialogRef.close(this.subjectForm.value);
      }
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public selectIcon(icon: ImageAsset) {
    this.subjectForm.controls.icon.setValue(icon.path);
  }
}
