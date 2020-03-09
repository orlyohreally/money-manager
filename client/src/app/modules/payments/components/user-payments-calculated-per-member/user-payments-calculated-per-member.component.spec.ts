import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculatedPerMemberComponent } from '../payments-calculated-per-member/payments-calculated-per-member.component';

describe('PaymentsCalculatedPerMemberComponent', () => {
  let component: PaymentsCalculatedPerMemberComponent;
  let fixture: ComponentFixture<PaymentsCalculatedPerMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentsCalculatedPerMemberComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsCalculatedPerMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
