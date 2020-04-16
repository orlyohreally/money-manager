import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'family-family-form',
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.scss']
})
export class FamilyFormComponent implements OnInit {
  @Input() familyForm: FormGroup;
  @Input() submittingForm: boolean;
  @Input() displayExchangeRate: boolean;
  @Input() errorMessage: string;

  @Output() formSubmitted = new EventEmitter<void>();

  familyMembers: Observable<
    {
      fullName: string;
      memberId: { familyId: string; userId: string };
      paymentPercentage: number;
    }[]
  >;

  constructor() {}

  ngOnInit() {}

  familyIconLoaded(icon: string) {
    this.familyForm.get('icon').setValue(icon);
  }

  submitForm() {
    if (!this.familyForm.valid) {
      this.familyForm.markAsTouched();
      return;
    }
    this.formSubmitted.emit();
  }

  onCurrencySelected(selectedCurrency: string) {
    this.familyForm.get('currency').setValue(selectedCurrency);
  }

  get familyName() {
    return this.familyForm.get('name');
  }
}
