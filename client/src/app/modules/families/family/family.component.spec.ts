import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { AvatarComponent } from '@shared-client/components/avatar/avatar.component';
import { findById } from '@shared-client/functions';
import { SortByPipeMock } from '@tests-utils/mocks';
import { FamiliesServiceMock } from '@tests-utils/mocks/families.service.spec';
// tslint:disable-next-line: max-line-length
import { FamilyIconPipeMock } from '@tests-utils/mocks/family-icon.pipe.spec';
// tslint:disable-next-line: max-line-length
import { FamilyActionsComponent } from '../family-actions/family-actions.component';
import { FamilyComponent } from './family.component';

describe('FamilyComponent', () => {
  let component: FamilyComponent;
  let fixture: ComponentFixture<FamilyComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let familiesServiceSpy: jasmine.SpyObj<FamiliesService>;

  const familiesServiceMock = FamiliesServiceMock();

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    familiesServiceSpy = familiesServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [
        FamilyComponent,
        FamilyIconPipeMock,
        SortByPipeMock,
        MockComponent(FamilyActionsComponent),
        MockComponent(AvatarComponent)
      ],
      imports: [RouterTestingModule, MatIconModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: FamiliesService,
          useValue: familiesServiceSpy
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: hot('a---b|', {
              a: convertToParamMap({
                familyId: familiesServiceMock.memberFamilies[0]._id
              }),
              b: convertToParamMap({
                familyId: familiesServiceMock.memberFamilies[1]._id
              })
            })
          }
        }
      ]
    });
  }));

  describe('Router has been changed after familiesInfo is emitted', () => {
    beforeEach(() => {
      initComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display family info which id is set in url', () => {
      getTestScheduler().flush();
      fixture.detectChanges();
      const familyName: HTMLElement = fixture.nativeElement.querySelector(
        '.family-info__name'
      );
      const expectedFamily = familiesServiceMock.memberFamilies[1];
      expect(familyName.textContent.trim()).toEqual(
        `${expectedFamily.name} family`
      );
      const membersCount: HTMLElement = fixture.nativeElement.querySelector(
        '.family-info__stats'
      );
      expect(membersCount.textContent.trim()).toEqual(
        `people_alt ${expectedFamily.membersCount} members`
      );
      const membersRoles: HTMLElement = fixture.nativeElement.querySelectorAll(
        '.family-info__stats'
      )[2];
      expect(membersRoles.textContent.trim()).toEqual(
        `bookmark ${expectedFamily.userRoles.join(' ')}`
      );
    });

    it(
      'should redirect to main page' + ' when family is not found',
      fakeAsync(() => {
        familiesServiceSpy.getFamilyById.and.returnValue(
          cold('--a', { a: undefined })
        );
        getTestScheduler().flush();
        fixture.detectChanges();
        tick();
        expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/not-found']);
      })
    );
  });

  describe('Router has been changed before familiesInfo is emitted', () => {
    beforeEach(() => {
      const updatedFamilies = [
        familiesServiceMock.memberFamilies[0],
        { ...familiesServiceMock.memberFamilies[1], name: 'Updated name' }
      ];
      familiesServiceSpy.getFamilyById.and.callFake((familyId: string) =>
        cold('--a', { a: findById(updatedFamilies, familyId) })
      );
      spyOnProperty(familiesServiceSpy, 'familiesInfo', 'get').and.returnValue(
        hot('--a----b|', {
          a: {
            families: familiesServiceMock.memberFamilies,
            currentFamily: familiesServiceMock.memberFamilies[0]
          },
          b: {
            families: updatedFamilies,
            currentFamily: updatedFamilies[0]
          }
        })
      );
      TestBed.overrideProvider(FamiliesService, {
        useValue: familiesServiceSpy
      });
      initComponent();
    });

    it('should update data when families info has been updated', () => {
      getTestScheduler().flush();
      fixture.detectChanges();

      const familyName: HTMLElement = fixture.nativeElement.querySelector(
        '.family-info__name'
      );
      const expectedFamily = familiesServiceMock.memberFamilies[1];
      expect(familyName.textContent.trim()).toEqual(`Updated name family`);
      const membersCount: HTMLElement = fixture.nativeElement.querySelector(
        '.family-info__stats'
      );
      expect(membersCount.textContent.trim()).toEqual(
        `people_alt ${expectedFamily.membersCount} members`
      );
      const membersRoles: HTMLElement = fixture.nativeElement.querySelectorAll(
        '.family-info__stats'
      )[2];
      expect(membersRoles.textContent.trim()).toEqual(
        `bookmark ${expectedFamily.userRoles.join(' ')}`
      );
    });
  });

  function initComponent() {
    TestBed.compileComponents();
    fixture = TestBed.createComponent(FamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }
});
