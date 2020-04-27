import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { MockComponent, MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
// tslint:disable-next-line: max-line-length
import { ScrollableContentDirective } from '@shared-client/directives/scrollable-content.directive';
import {
  PrefixedNumberPipeMock,
  UserFullNamePipeMock
} from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { MemberPaymentOverpayAndDebtListComponent } from './member-payment-overpay-and-debt-list.component';

describe('MemberPaymentOverpayAndDebtListComponent', () => {
  let component: MemberPaymentOverpayAndDebtListComponent;
  let fixture: ComponentFixture<MemberPaymentOverpayAndDebtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MemberPaymentOverpayAndDebtListComponent,
        PrefixedNumberPipeMock,
        UserFullNamePipeMock,
        MockDirective(ScrollableContentDirective),
        MockComponent(LoaderComponent)
      ],
      imports: [MatTableModule, MatSortModule, MatPaginatorModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPaymentOverpayAndDebtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
