import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatMenuModule,
  MatTooltipModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FamilyMemberIconPipeMock,
  SortByPipeMock
} from '@src/app/tests-utils/mocks';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { AvatarComponent } from '@shared-client/components/avatar/avatar.component';
import { FamilyMember, Roles } from '@shared/types';
import { MemberRole } from '@src/app/types';
// tslint:disable-next-line: max-line-length
import { UserFullNamePipeMock } from '@tests-utils/mocks/user-full-name.pipe.spec';
import { FamilyMemberCardComponent } from './family-member-card.component';

@Component({
  template: `
    <family-member-card [member]="member" [roles]="roles"></family-member-card>
  `
})
class ParentComponent {
  member: FamilyMember;
  roles: { [roleName: string]: MemberRole };

  @ViewChild(FamilyMemberCardComponent)
  familyMemberCardComponent: FamilyMemberCardComponent;
}

describe('FamilyMemberCardComponent', () => {
  let component: FamilyMemberCardComponent;
  let parentComponent: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FamilyMemberCardComponent,
        ParentComponent,
        MockComponent(AvatarComponent),
        UserFullNamePipeMock,
        FamilyMemberIconPipeMock,
        SortByPipeMock
      ],
      imports: [
        MatIconModule,
        MatMenuModule,
        RouterTestingModule,
        MatTooltipModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    parentComponent = fixture.componentInstance;
    parentComponent.member = {
      _id: 'memberId-1',
      firstName: 'firstName-1',
      lastName: 'lastName-1',
      email: 'email-1',
      roles: [Roles.Admin, Roles.Member],
      icon: 'icon-1',
      paymentPercentage: 100,
      inactive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    parentComponent.roles = {
      [Roles.Member as string]: {
        name: Roles.Member,
        description: 'Member role',
        default: false
      },
      [Roles.Admin as string]: {
        name: Roles.Admin,
        description: 'Admin role',
        default: false
      }
    };
    fixture.detectChanges();
    component = parentComponent.familyMemberCardComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
