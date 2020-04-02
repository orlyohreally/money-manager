import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import { PrefixedNumberPipeMock } from '@tests-utils/mocks';
import { UserPaymentsListComponent } from './user-payment-list.component';

describe('UserPaymentsListComponent', () => {
  let component: UserPaymentsListComponent;
  let fixture: ComponentFixture<UserPaymentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserPaymentsListComponent,
        PrefixedNumberPipeMock,
        MockComponent(LoaderComponent)
      ],
      imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        RouterTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
