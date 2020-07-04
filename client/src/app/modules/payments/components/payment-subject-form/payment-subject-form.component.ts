import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { ImageAssetService } from '@core-client/services/image-asset/image-asset.service';
import { HtmlElementRepresentation } from '@shared-client/types/html-element';
import { Family, ImageAsset, PaymentSubject } from '@shared/types';

@Component({
  selector: 'payment-payment-subject-form',
  templateUrl: './payment-subject-form.component.html',
  styleUrls: ['./payment-subject-form.component.scss']
})
export class PaymentSubjectFormComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PaymentSubjectFormComponent>,
    private imageAssetService: ImageAssetService,
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
        icon: null // this.subjectIcons[0].path
      };
    }

    this.subjectForm = new FormGroup({
      _id: new FormControl(subject._id),
      name: new FormControl(subject.name, [Validators.required]),
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

  public cancel(): void {
    this.dialogRef.close();
  }

  public selectIcon(icon: HtmlElementRepresentation) {
    this.subjectForm.controls.icon.setValue(icon.id);
  }
}
