import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import {
  PrefixedNumberPipeMock,
  UserFullNamePipeMock
} from '@tests-utils/mocks';
import { PaymentListComponent } from './payment-list.component';

describe('PaymentListComponent', () => {
  let component: PaymentListComponent;
  let fixture: ComponentFixture<PaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(LoaderComponent),
        PaymentListComponent,
        PrefixedNumberPipeMock,
        UserFullNamePipeMock
      ],
      imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule
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
