import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import { PrefixedNumberPipeMock } from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { UserPaymentsCalculatedPerMemberComponent } from './user-payments-calculated-per-member.component';

describe('UserPaymentsCalculatedPerMemberComponent', () => {
  let component: UserPaymentsCalculatedPerMemberComponent;
  let fixture: ComponentFixture<UserPaymentsCalculatedPerMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserPaymentsCalculatedPerMemberComponent,
        PrefixedNumberPipeMock,
        MockComponent(LoaderComponent)
      ],
      imports: [MatTableModule, MatSortModule, MatPaginatorModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentsCalculatedPerMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
