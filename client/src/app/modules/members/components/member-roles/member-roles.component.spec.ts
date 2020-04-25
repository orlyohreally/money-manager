import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { CheckboxComponent } from '@shared-client/check-list/components/checkbox/checkbox.component';
// tslint:disable-next-line: max-line-length
import { CheckListTitleDirective } from '@shared-client/check-list/directives/check-list-title.directive';
// tslint:disable-next-line: max-line-length
import { CheckboxGroupDirective } from '@shared-client/check-list/directives/checkbox-group.directive';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import { MembersServiceMock } from '@tests-utils/mocks';
import { MemberRolesComponent } from './member-roles.component';

describe('MemberRolesComponent', () => {
  let component: MemberRolesComponent;
  let fixture: ComponentFixture<MemberRolesComponent>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;

  const membersServiceMock = MembersServiceMock();

  beforeEach(async(() => {
    membersServiceSpy = membersServiceMock.getService();

    TestBed.configureTestingModule({
      declarations: [
        MemberRolesComponent,
        MockDirective(CheckboxGroupDirective),
        MockDirective(CheckListTitleDirective),
        MockComponent(CheckboxComponent),
        MockComponent(LoaderComponent)
      ],
      providers: [{ provide: MembersService, useValue: membersServiceSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // async function selectRoles() {
  //   const roles: CheckboxComponent[] = fixture.debugElement
  //     .queryAll(By.directive(CheckboxComponent))
  //     .map((checkListItem: DebugElement) => checkListItem.componentInstance);
  //   roles[0].changedValue.emit(true);
  //   roles[1].changedValue.emit(true);
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  // }
});
