import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { PaymentSubjectComponent } from '../payment-subject/payment-subject.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectSelectorComponent } from './payment-subject-selector.component';

describe('PaymentSubjectSelectorComponent', () => {
  let component: PaymentSubjectSelectorComponent;
  let fixture: ComponentFixture<PaymentSubjectSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaymentSubjectSelectorComponent,
        MockComponent(PaymentSubjectComponent)
      ],
      imports: [
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSubjectSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
