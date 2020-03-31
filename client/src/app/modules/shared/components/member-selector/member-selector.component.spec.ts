import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FamilyMember } from '@shared/types';
// tslint:disable-next-line: max-line-length
import { FamilyMemberIconPipeMock } from '@tests-utils/mocks/family-member-icon.pipe.spec';
// tslint:disable-next-line: max-line-length
import { UserFullNamePipeMock } from '@tests-utils/mocks/user-full-name.pipe.spec';
import { MemberSelectorComponent } from './member-selector.component';

@Component({
  template: `
    <shared-member-selector
      [members]="members"
      [selectorLabel]="selectorLabel"
      [defaultMemberId]="defaultMemberId"
      [required]="required"
      (memberSelected)="onMemberSelected($event)"
    ></shared-member-selector>
  `
})
class MockParentComponent {
  members: FamilyMember[];
  selectorLabel: string;
  defaultMemberId: string;
  required: boolean;

  @ViewChild(MemberSelectorComponent)
  memberSelectorComponent: MemberSelectorComponent;

  onMemberSelected() {}
}

describe('MemberSelectorComponent', () => {
  let component: MemberSelectorComponent;
  let parentComponent: MockParentComponent;
  let fixture: ComponentFixture<MockParentComponent>;

  const mockedMembers: FamilyMember[] = [
    {
      _id: 'member-Id-1',
      firstName: 'firstName-1',
      lastName: 'lastName-1',
      email: 'email-1',
      roles: ['Admin'],
      icon: 'icon-1',
      paymentPercentage: 10,
      inactive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'member-Id-2',
      firstName: 'firstName-2',
      lastName: 'lastName-2',
      email: 'email-2',
      roles: ['Admin'],
      icon: 'icon-2',
      paymentPercentage: 20,
      inactive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MemberSelectorComponent,
        MockParentComponent,
        FamilyMemberIconPipeMock,
        UserFullNamePipeMock
      ],
      imports: [
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockParentComponent);
    parentComponent = fixture.componentInstance;
  });

  describe('default value is set', () => {
    beforeEach(() => {
      parentComponent.members = mockedMembers;
      parentComponent.defaultMemberId = 'member-Id-2';
      spyOn(parentComponent, 'onMemberSelected');
      fixture.detectChanges();
      component = parentComponent.memberSelectorComponent;
    });

    it('should emit default option when defaultMemberId is set', () => {
      expect(parentComponent.onMemberSelected).toHaveBeenCalledTimes(1);
    });
  });

  describe('default value is not set', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component = parentComponent.memberSelectorComponent;
      parentComponent.members = mockedMembers;
      fixture.detectChanges();
    });

    it('should display list of members', () => {
      expect(getSelector().textContent.trim()).toEqual('');
      const options = getSelectorOptions();
      expect(options.length).toBe(3);
      expect(options[0].textContent).toEqual('Any member');
      expect(options[1].textContent.trim()).toEqual('firstName-1 lastName-1');
      expect(options[1].querySelector('img').src).toContain(
        'icon-for-firstName-1-lastName-1-member'
      );
      expect(options[2].textContent.trim()).toEqual('firstName-2 lastName-2');
      expect(options[2].querySelector('img').src).toContain(
        'icon-for-firstName-2-lastName-2-member'
      );
    });

    it(
      'label for selector should be "selector label"' +
        ' when selectorLabel is set to "selector label"',
      () => {
        parentComponent.selectorLabel = 'selector label';
        fixture.detectChanges();
        const labelEl = fixture.nativeElement.querySelector('mat-label');
        expect(labelEl.textContent.trim()).toEqual('selector label');
      }
    );

    it('value should be required when required is set to true', () => {
      parentComponent.required = true;
      parentComponent.defaultMemberId = 'member-Id-2';
      fixture.detectChanges();
      const options = getSelectorOptions();
      (options[0] as HTMLElement).click();
      fixture.detectChanges();
      expect(getErrorEl().textContent.trim()).toEqual('Required field');
    });

    it('value should not be required when required is set to false', () => {
      parentComponent.required = false;
      parentComponent.defaultMemberId = 'member-Id-2';
      fixture.detectChanges();
      const options = getSelectorOptions();
      (options[0] as HTMLElement).click();
      fixture.detectChanges();
      expect(getErrorEl()).toBeFalsy();
    });

    it(
      'should call memberSelected.emit' +
        ' when member is reselected to valid value',
      () => {
        spyOn(parentComponent, 'onMemberSelected');
        const options = getSelectorOptions();
        (options[2] as HTMLElement).click();
        fixture.detectChanges();
        expect(parentComponent.onMemberSelected).toHaveBeenCalledTimes(1);
        expect(parentComponent.onMemberSelected).toHaveBeenCalledWith(
          'member-Id-2'
        );
      }
    );

    it(
      'should not call memberSelected.emit' +
        ' when member is reselected to invalid value',
      () => {
        parentComponent.required = true;
        parentComponent.defaultMemberId = 'member-Id-2';
        fixture.detectChanges();
        spyOn(parentComponent, 'onMemberSelected');
        const options = getSelectorOptions();
        (options[0] as HTMLElement).click();
        fixture.detectChanges();
        expect(parentComponent.onMemberSelected).not.toHaveBeenCalled();
      }
    );
  });

  function getSelector() {
    return fixture.nativeElement.querySelector('mat-select');
  }

  function getSelectorOptions() {
    const selectEl = getSelector();
    selectEl.click();
    fixture.detectChanges();
    return document.querySelectorAll('.mat-select-panel .mat-option');
  }

  function getErrorEl() {
    return fixture.nativeElement.querySelector('mat-error');
  }
});
