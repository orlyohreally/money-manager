import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { MockComponent, MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { NotificationBlockDirective } from '@shared-client/directives/notification-block.directive';
import { getNotificationsSpy, getRouterSpy } from '@src/app/tests-utils/mocks';
import { FamiliesServiceMock } from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { MemberRolesComponent } from '../../members/components/member-roles/member-roles.component';
import { FamilyFormComponent } from '../family-form/family-form.component';
import { NewFamilyFormComponent } from './new-family-form.component';

describe('NewFamilyFormComponent', () => {
  let component: NewFamilyFormComponent;
  let fixture: ComponentFixture<NewFamilyFormComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<NewFamilyFormComponent>>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let familiesServiceSpy: jasmine.SpyObj<FamiliesService>;

  const familiesServiceMock = FamiliesServiceMock();

  beforeEach(async(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    notificationsServiceSpy = getNotificationsSpy();
    routerSpy = getRouterSpy();
    familiesServiceSpy = familiesServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [
        NewFamilyFormComponent,
        MockComponent(FamilyFormComponent),
        MockComponent(MemberRolesComponent),
        MockDirective(NotificationBlockDirective)
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: FamiliesService, useValue: familiesServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFamilyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
