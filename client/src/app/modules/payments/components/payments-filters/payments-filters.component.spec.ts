import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { DateSelectorComponent } from '@shared-client/components/date-selector/date-selector.component';
// tslint:disable-next-line: max-line-length
import { MemberSelectorComponent } from '@shared-client/components/member-selector/member-selector.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectSelectorComponent } from '@shared-client/components/payment-subject-selector/payment-subject-selector.component';
import { PaymentsFiltersComponent } from './payments-filters.component';

describe('PaymentsFiltersComponent', () => {
  let component: PaymentsFiltersComponent;
  let fixture: ComponentFixture<PaymentsFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaymentsFiltersComponent,
        MockComponent(MemberSelectorComponent),
        MockComponent(DateSelectorComponent),
        MockComponent(PaymentSubjectSelectorComponent)
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
