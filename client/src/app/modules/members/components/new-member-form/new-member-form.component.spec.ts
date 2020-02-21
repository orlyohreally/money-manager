import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatInputModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { CheckboxComponent } from '@shared-client/check-list/components/checkbox/checkbox.component';
// tslint:disable-next-line: max-line-length
import { NotificationMessageComponent } from '@shared-client/components/notification-message/notification-message.component';
// tslint:disable-next-line: max-line-length
import { SharedModule } from '@src/app/modules/shared/shared.module';
import { expectTextContentToBe } from '@src/app/tests-utils/index.spec';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { NewFamilyMemberFormComponent } from './new-member-form.component';
// tslint:disable-next-line: max-line-length

describe('MemberFormComponent', () => {
  let component: NewFamilyMemberFormComponent;
  let fixture: ComponentFixture<NewFamilyMemberFormComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<NewFamilyMemberFormComponent>>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;

  beforeEach(async(() => {
    dialogRefSpy = jasmine.createSpyObj('MetDialogRef', ['close']);

    notificationsServiceSpy = jasmine.createSpyObj('NotificationsService', [
      'showNotification'
    ]);
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
      declarations: [NewFamilyMemberFormComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        MatInputModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { familyId: 'familyId', member: {} }
        },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MembersService, useValue: membersServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy }
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
      const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector(
        'button'
      );
      submitButton.click();
      expect(membersServiceSpy.addFamilyMember).toHaveBeenCalledTimes(1);
      expect(membersServiceSpy.addFamilyMember).toHaveBeenCalledWith(
        'familyId',
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
      // tslint:disable-next-line: max-line-length
      const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector(
        'button'
      );
      submitButton.click();
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
      // tslint:disable-next-line: max-line-length
      const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector(
        'button'
      );
      submitButton.click();
      getTestScheduler().flush();
      fixture.detectChanges();
      const errorMessage: DebugElement = fixture.debugElement.query(
        By.directive(NotificationMessageComponent)
      );
      expectTextContentToBe(errorMessage.nativeElement, 'error message');
      expect(
        (errorMessage.componentInstance as NotificationMessageComponent).type
      ).toBe('error');
    }
  );

  function getEmailInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      '[formControlName="email"]'
    ) as HTMLInputElement;
  }

  async function selectRoles() {
    const roles: CheckboxComponent[] = fixture.debugElement
      .queryAll(By.directive(CheckboxComponent))
      .map((checkListItem: DebugElement) => checkListItem.componentInstance);
    roles[0].changedValue.emit(true);
    roles[1].changedValue.emit(true);
    fixture.detectChanges();
    await fixture.whenStable();
  }
});
