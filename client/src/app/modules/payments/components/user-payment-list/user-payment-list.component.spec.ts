import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentsListComponent } from './user-payments-list.component';

describe('UserPaymentsListComponent', () => {
  let component: UserPaymentsListComponent;
  let fixture: ComponentFixture<UserPaymentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPaymentsListComponent ]
    })
    .compileComponents();
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
