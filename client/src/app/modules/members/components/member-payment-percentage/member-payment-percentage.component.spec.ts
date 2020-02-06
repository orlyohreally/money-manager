import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// tslint:disable-next-line: max-line-length
import { MemberPaymentPercentageComponent } from './member-payment-percentage.component';

describe('MemberPaymentPercentageComponent', () => {
  let component: MemberPaymentPercentageComponent;
  let fixture: ComponentFixture<MemberPaymentPercentageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberPaymentPercentageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPaymentPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
