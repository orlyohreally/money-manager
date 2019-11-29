import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Family } from '@shared/types';
import { FamiliesService } from 'src/app/modules/families/services/families/families.service';

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

  closeForm() {
    console.log(this.familyForm.valid);
    if (!this.familyForm.valid) {
      this.familyForm.markAsTouched();
      return;
    }
    this.dialogRef.close(this.familyForm.value);
  }

  onImageChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.familyForm.patchValue({
          icon: reader.result
        });
      };
    }
  }
}
