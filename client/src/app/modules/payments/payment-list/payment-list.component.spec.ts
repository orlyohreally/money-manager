import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import { MockComponent, MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import {
  PrefixedNumberPipeMock,
  UserFullNamePipeMock
} from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { ViewFamilyPaymentDialogTriggerDirective } from '../directives/view-family-payment-dialog-trigger.directive';
import { PaymentListComponent } from './payment-list.component';

describe('PaymentListComponent', () => {
  let component: PaymentListComponent;
  let fixture: ComponentFixture<PaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(LoaderComponent),
        MockDirective(ViewFamilyPaymentDialogTriggerDirective),
        PaymentListComponent,
        PrefixedNumberPipeMock,
        UserFullNamePipeMock
      ],
      imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        MatIconModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
