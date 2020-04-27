import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import { MembersServiceMock } from '@tests-utils/mocks/members.service.spec';
// tslint:disable-next-line: max-line-length
import { FamilyMemberCardComponent } from '../family-member-card/family-member-card.component';
import { FamilyMembersComponent } from './family-members.component';

describe('FamilyMembersComponent', () => {
  let component: FamilyMembersComponent;
  let fixture: ComponentFixture<FamilyMembersComponent>;

  const membersServiceMock = MembersServiceMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FamilyMembersComponent,
        MockComponent(FamilyMemberCardComponent),
        MockComponent(LoaderComponent)
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { params: of({}) }
          }
        },
        { provide: MembersService, useValue: membersServiceMock.service }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
