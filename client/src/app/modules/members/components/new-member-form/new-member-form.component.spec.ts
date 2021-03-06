import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { MockComponent, MockHelper } from 'ng-mocks';

import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { NotificationBlockDirective } from '@shared-client/directives/notification-block.directive';
import { SharedModule } from '@shared-client/shared.module';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@src/app/core/services/families/families.service';
import { expectTextContentToBe } from '@tests-utils/functions';
import { FamiliesServiceMock, getNotificationsSpy } from '@tests-utils/mocks';
import { MemberRolesComponent } from '../member-roles/member-roles.component';
// tslint:disable-next-line: max-line-length
import { MembersPaymentPercentageComponent } from '../members-payment-percentage/members-payment-percentage.component';
import { NewFamilyMemberFormComponent } from './new-member-form.component';

describe('NewFamilyMemberFormComponent', () => {
  let component: NewFamilyMemberFormComponent;
  let fixture: ComponentFixture<NewFamilyMemberFormComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<NewFamilyMemberFormComponent>>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;
  let familiesServiceSpy: jasmine.SpyObj<FamiliesService>;

  const familiesServiceMock = FamiliesServiceMock();

  beforeEach(async(() => {
    dialogRefSpy = jasmine.createSpyObj('MetDialogRef', ['close']);
    notificationsServiceSpy = getNotificationsSpy();
    familiesServiceSpy = FamiliesServiceMock().service;
    membersServiceSpy = jasmine.createSpyObj('MembersService', [
      'addFamilyMember',
      'getRoles'
    ]);
    membersServiceSpy.getRoles.and.returnValue(
      cold('--a', {
        a: [
          { name: 'Admin', description: 'admin description' },
          { name: 'Member', description: 'member description' }
        ]
      })
    );
    membersServiceSpy.addFamilyMember.and.returnValue(
      cold('---a', { a: 'success' })
    );

    TestBed.configureTestingModule({
      declarations: [
        NewFamilyMemberFormComponent,
        MockComponent(MemberRolesComponent),
        MockComponent(MembersPaymentPercentageComponent)
      ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        MatInputModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { family: familiesServiceMock.family, member: {} }
        },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MembersService, useValue: membersServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: FamiliesService, useValue: familiesServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFamilyMemberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display input for email', () => {
    getTestScheduler().flush();
    fixture.detectChanges();
    expect(getEmailInput()).toBeTruthy();
  });

  it(
    'should call this.membersService.addFamilyMember' +
      ' when clicked button for valid form',
    async () => {
      getTestScheduler().flush();
      fixture.detectChanges();
      await selectRoles();
      const emailInput = getEmailInput();
      emailInput.value = 'email@gmail.com';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      // tslint:disable-next-line: max-line-length
      getSubmitButton().click();
      expect(membersServiceSpy.addFamilyMember).toHaveBeenCalledTimes(1);
      expect(membersServiceSpy.addFamilyMember).toHaveBeenCalledWith(
        familiesServiceMock.family._id,
        {
          email: 'email@gmail.com',
          roles: ['Admin', 'Member']
        }
      );
    }
  );

  it(
    'should not call this.membersService.addFamilyMember' +
      ' when clicked button for invalid form',
    async () => {
      getTestScheduler().flush();
      fixture.detectChanges();
      await selectRoles();
      getSubmitButton().click();
      expect(membersServiceSpy.addFamilyMember).not.toHaveBeenCalled();
    }
  );

  it(
    'should display error message' +
      ' when membersService.addFamilyMember returns error.email',
    async () => {
      membersServiceSpy.addFamilyMember.and.returnValue(
        cold(
          '--#',
          null,
          new HttpErrorResponse({ error: { message: 'error message' } })
        )
      );
      getTestScheduler().flush();
      fixture.detectChanges();
      await selectRoles();
      const emailInput = getEmailInput();
      emailInput.value = 'email@gmail.com';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      getSubmitButton().click();
      getTestScheduler().flush();
      fixture.detectChanges();
      const errorMessage: DebugElement = fixture.debugElement.query(
        By.directive(NotificationBlockDirective)
      );
      expectTextContentToBe(errorMessage.nativeElement, 'error message');
      const messageDirective = MockHelper.getDirective(
        fixture.debugElement.query(By.directive(NotificationBlockDirective)),
        NotificationBlockDirective
      );
      expect(messageDirective.type).toBe('error');
    }
  );

  function getEmailInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      '[formControlName="email"]'
    ) as HTMLInputElement;
  }

  async function selectRoles() {
    const memberRoles: MemberRolesComponent = fixture.debugElement.query(
      By.directive(MemberRolesComponent)
    ).componentInstance;
    memberRoles.initialized.emit();
    memberRoles.rolesUpdated.emit(['Admin', 'Member']);
    fixture.detectChanges();
    await fixture.whenStable();
    // const roles: CheckboxComponent[] = fixture.debugElement
    //   .queryAll(By.directive(CheckboxComponent))
    //   .map((checkListItem: DebugElement) => checkListItem.componentInstance);
    // roles[0].changedValue.emit(true);
    // roles[1].changedValue.emit(true);
    // fixture.detectChanges();
    // await fixture.whenStable();
  }

  function getSubmitButton() {
    return fixture.nativeElement.querySelector('button[type="submit"]');
  }
});
