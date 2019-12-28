import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

// tslint:disable-next-line: max-line-length
import { ImageAssetService } from '@core-client/services/image-asset/image-asset.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '@core-client/services/payment-subject/payment-subjects.service';

import { Family, ImageAsset, PaymentSubject } from '@shared/types';

import { HtmlElementRepresentation } from '@shared-client/types/html-element';
import { Observable } from 'rxjs';

@Component({
  selector: 'payment-payment-subject-form',
  templateUrl: './payment-subject-form.component.html',
  styleUrls: ['./payment-subject-form.component.scss']
})
export class PaymentSubjectFormComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PaymentSubjectFormComponent>,
    private imageAssetService: ImageAssetService,
    private paymentSubjectsService: PaymentSubjectsService,
    @Inject(MAT_DIALOG_DATA) public data: PaymentSubject
  ) {}
  subjectForm: FormGroup;
  families: Observable<Family[]>;
  subjectIcons: HtmlElementRepresentation[];
  ngOnInit() {
    this.getFamilies();
    this.getIcons();
    this.initForm(this.data);
  }
  private getIcons() {
    const generateElements = (icon: ImageAsset) => ({
      id: icon.path,
      innerHTML: `<img src="${icon.path}"/>`,
      classes: 'subject-icon clickable'
    });

    this.subjectIcons = this.imageAssetService
      .getImageAssetsByCategory('payment-subject')
      .map(generateElements);
  }
  private initForm(subject: Partial<PaymentSubject>) {
    if (!subject) {
      subject = {
        _id: null,
        name: null,
        familyId: null,
        icon: null // this.subjectIcons[0].path
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
    return 'You must enter a value';
  }
  get _id() {
    return this.subjectForm.get('_id');
  }

  get name() {
    return this.subjectForm.get('name');
  }

  get familyId() {
    return this.subjectForm.get('familyId');
  }

  get icon() {
    return this.subjectForm.get('icon');
  }

  private async getFamilies() {
    this.families = null; // this.familiesService.membersFamilies;
  }

  public async saveSubject() {
    if (!this.subjectForm.valid) {
      // tslint:disable-next-line: forin
      for (const control in this.subjectForm.controls) {
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

  public selectIcon(icon: HtmlElementRepresentation) {
    this.subjectForm.controls.icon.setValue(icon.id);
  }
}
