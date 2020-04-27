import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import {
  FamiliesServiceMock,
  IFamiliesServiceMock
} from '@tests-utils/mocks/families.service.spec';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { FamiliesComponent } from './families.component';
import { FamilyCardComponent } from './family-card/family-card.component';

describe('FamiliesComponent', () => {
  let component: FamiliesComponent;
  let fixture: ComponentFixture<FamiliesComponent>;

  const familiesMock: IFamiliesServiceMock = FamiliesServiceMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FamiliesComponent,
        MockComponent(FamilyCardComponent),
        MockComponent(LoaderComponent)
      ],
      providers: [{ provide: FamiliesService, useValue: familiesMock.service }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamiliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
