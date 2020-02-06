import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// tslint:disable-next-line: max-line-length
import { MembersPaymentPercentageComponent } from './members-payment-percentage.component';

describe('MembersPaymentPercentageComponent', () => {
  let component: MembersPaymentPercentageComponent;
  let fixture: ComponentFixture<MembersPaymentPercentageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MembersPaymentPercentageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersPaymentPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
