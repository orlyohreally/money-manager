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
    this.formSubmitted.emit();
  }
}
