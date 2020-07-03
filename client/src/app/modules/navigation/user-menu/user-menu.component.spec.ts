import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';

import { User } from '@shared/types';
import {
  AuthenticationServiceMock,
  FamilyMemberIconPipeMock
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserMenuComponent,
        ParentComponent,
        UserFullNamePipeMock,
        FamilyMemberIconPipeMock
      ],
      imports: [MatMenuModule, MatIconModule, RouterTestingModule]
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
