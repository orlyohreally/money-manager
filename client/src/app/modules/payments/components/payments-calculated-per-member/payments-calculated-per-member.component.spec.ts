import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// tslint:disable-next-line: max-line-length
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MockComponent, MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
// tslint:disable-next-line: max-line-length
import { ScrollableContentDirective } from '@shared-client/directives/scrollable-content.directive';
import { UserFullNamePipe } from '@shared-client/pipes/user-full-name.pipe';
import {
  PaymentsCalculationsServiceMock,
  PrefixedNumberPipeMock,
  UserFullNamePipeMock
} from '@src/app/tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculatedPerMemberComponent } from './payments-calculated-per-member.component';

describe('PaymentsCalculatedPerMemberComponent', () => {
  let component: PaymentsCalculatedPerMemberComponent;
  let fixture: ComponentFixture<PaymentsCalculatedPerMemberComponent>;
  // tslint:disable-next-line: max-line-length
  let paymentsCalculationsServiceSpy: jasmine.SpyObj<PaymentsCalculationsService>;
  let userFullNamePipeSpy: jasmine.SpyObj<UserFullNamePipe>;

  const paymentsCalculationsServiceMock = PaymentsCalculationsServiceMock();

  beforeEach(async(() => {
    paymentsCalculationsServiceSpy = paymentsCalculationsServiceMock.service;
    userFullNamePipeSpy = jasmine.createSpyObj('UserFullNamePipe', [
      'transform'
    ]);
    userFullNamePipeSpy.transform.and.callFake(
      new UserFullNamePipeMock().transform
    );

    TestBed.configureTestingModule({
      declarations: [
        PaymentsCalculatedPerMemberComponent,
        UserFullNamePipeMock,
        PrefixedNumberPipeMock,
        MockComponent(LoaderComponent),
        MockDirective(ScrollableContentDirective)
      ],
      imports: [MatTableModule, MatSortModule, MatPaginatorModule],
      providers: [
        {
          provide: PaymentsCalculationsService,
          useValue: paymentsCalculationsServiceSpy
        },
        { provide: UserFullNamePipe, useValue: userFullNamePipeSpy }
      ]
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
