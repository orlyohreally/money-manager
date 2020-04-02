import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { AvatarComponent } from '@shared-client/components/avatar/avatar.component';
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

  const familiesServiceMock = FamiliesServiceMock();

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        FamilyComponent,
        FamilyIconPipeMock,
        MockComponent(FamilyActionsComponent),
        MockComponent(AvatarComponent)
      ],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: FamiliesService,
          useValue: familiesServiceMock.service
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({}))
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
