import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent<T> implements OnInit {
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<T>) {}

  ngOnInit() {}

  submitForm() {
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }
}
