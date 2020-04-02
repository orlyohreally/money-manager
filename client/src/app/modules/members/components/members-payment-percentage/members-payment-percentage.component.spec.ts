import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import {
  IMembersServiceMock,
  IUserManagerServiceMock,
  MembersServiceMock,
  UserManagerServiceMock
} from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { MemberPaymentPercentageComponent } from '../member-payment-percentage/member-payment-percentage.component';
// tslint:disable-next-line: max-line-length
import { MembersPaymentPercentageComponent } from './members-payment-percentage.component';

describe('MembersPaymentPercentageComponent', () => {
  let component: MembersPaymentPercentageComponent;
  let fixture: ComponentFixture<MembersPaymentPercentageComponent>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;
  let userManagerServiceSpy: jasmine.SpyObj<UserManagerService>;

  const membersServiceMock: IMembersServiceMock = MembersServiceMock();
  // tslint:disable-next-line: max-line-length
  const userManagerServiceMock: IUserManagerServiceMock = UserManagerServiceMock();

  beforeEach(async(() => {
    membersServiceSpy = membersServiceMock.service;
    userManagerServiceSpy = userManagerServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [
        MembersPaymentPercentageComponent,
        MockComponent(LoaderComponent),
        MockComponent(MembersPaymentPercentageComponent),
        MockComponent(MemberPaymentPercentageComponent)
      ],
      imports: [RouterTestingModule, MatIconModule, ReactiveFormsModule],
      providers: [
        { provide: UserManagerService, useValue: userManagerServiceSpy },
        { provide: MembersService, useValue: membersServiceSpy }
      ]
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
