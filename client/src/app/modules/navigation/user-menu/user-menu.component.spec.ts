import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
import { User } from '@shared/types';
import {
  AuthenticationServiceMock,
  UserManagerServiceMock
} from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { UserFullNamePipeMock } from '@tests-utils/mocks/user-full-name.pipe.spec';
import { UserMenuComponent } from './user-menu.component';

@Component({
  template: `
    <nav-user-menu [user]="user"></nav-user-menu>
  `
})
class ParentComponent {
  user: User;
  @ViewChild(UserMenuComponent) userMenuComponent: UserMenuComponent;
}

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let parentComponent: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;
  let userManagerServiceSpy: jasmine.SpyObj<UserManagerService>;

  const userManagerServiceMock = UserManagerServiceMock();

  beforeEach(async(() => {
    userManagerServiceSpy = userManagerServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [UserMenuComponent, ParentComponent, UserFullNamePipeMock],
      imports: [MatMenuModule, MatIconModule, RouterTestingModule],
      providers: [
        { provide: UserManagerService, useValue: userManagerServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    parentComponent = fixture.componentInstance;
    parentComponent.user = AuthenticationServiceMock().user;
    fixture.detectChanges();
    component = parentComponent.userMenuComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
