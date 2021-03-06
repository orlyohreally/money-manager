import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'shared-value-editor',
  templateUrl: './value-editor.component.html',
  styleUrls: ['./value-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValueEditorComponent implements OnInit, OnChanges {
  @Input() value: string;

  @Output() valueSubmitted = new EventEmitter<string>();

  valueForm: FormControl;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.valueForm) {
      this.valueForm.setValue(changes.value.currentValue);
      return;
    }
    this.valueForm = new FormControl(
      changes.value.currentValue,
      Validators.required
    );
  }

  submitValue() {
    if (this.valueForm.valid) {
      this.valueSubmitted.emit(this.valueForm.value);
    }
  }
}
