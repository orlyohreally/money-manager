import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { AvatarComponent } from '@shared-client/components/avatar/avatar.component';
import { FamilyIconPipeMock } from '@tests-utils/mocks/family-icon.pipe.spec';
// tslint:disable-next-line: max-line-length
import { EditFamilyDialogTriggerDirective } from '../directives/edit-family-dialog-trigger/edit-family-dialog-trigger.directive';
import { FamilyCardComponent } from './family-card.component';

describe('FamilyCardComponent', () => {
  let component: FamilyCardComponent;
  let fixture: ComponentFixture<FamilyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FamilyCardComponent,
        FamilyIconPipeMock,
        MockDirective(EditFamilyDialogTriggerDirective),
        MockDirective(AvatarComponent)
      ],
      imports: [MatMenuModule, MatIconModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
