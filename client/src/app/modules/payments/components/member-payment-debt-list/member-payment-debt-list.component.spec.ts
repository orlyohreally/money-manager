import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSortModule, MatTableModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// tslint:disable-next-line: max-line-length
import { ColoredNumberDirective } from '@shared-client/directives/colored-number/colored-number.directive';
// tslint:disable-next-line: max-line-length
import { ScrollableContentDirective } from '@shared-client/directives/scrollable-content.directive';
import {
  PrefixedNumberPipeMock,
  UserFullNamePipeMock
} from '@tests-utils/mocks';
import { MockDirective } from 'ng-mocks';
// tslint:disable-next-line: max-line-length
import { MemberPaymentDebtListComponent } from './member-payment-debt-list.component';

describe('MemberPaymentDebtListComponent', () => {
  let component: MemberPaymentDebtListComponent;
  let fixture: ComponentFixture<MemberPaymentDebtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MemberPaymentDebtListComponent,
        PrefixedNumberPipeMock,
        UserFullNamePipeMock,
        MockDirective(ScrollableContentDirective),
        MockDirective(ColoredNumberDirective)
      ],
      imports: [MatTableModule, MatSortModule, NoopAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPaymentDebtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
