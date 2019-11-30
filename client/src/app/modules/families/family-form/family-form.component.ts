import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Family } from '@shared/types';

@Component({
  selector: 'family-family-form',
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.scss']
})
export class FamilyFormComponent implements OnInit {
  familyForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FamilyFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public family: Family
  ) {}

  ngOnInit() {
    this.familyForm = new FormGroup({
      name: new FormControl(this.family ? this.family.name : '', [
        Validators.required
      ]),
      icon: new FormControl(this.family ? this.family.icon : '')
    });
  }

  familyIconLoaded(icon: string) {
    this.familyForm.get('icon').setValue(icon);
  }

  submitForm() {
    if (!this.familyForm.valid) {
      this.familyForm.markAsTouched();
      return;
    }
    this.dialogRef.close(this.familyForm.value);
  }
}
