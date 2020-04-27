import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { AddMemberDirective } from '../../members/directives/add-member/add-member.directive';
// tslint:disable-next-line: max-line-length
import { DeleteFamilyDirective } from '../directives/delete-family/delete-family.directive';
// tslint:disable-next-line: max-line-length
import { EditFamilyDialogTriggerDirective } from '../directives/edit-family-dialog-trigger/edit-family-dialog-trigger.directive';
import { FamilyActionsComponent } from './family-actions.component';

describe('FamilyActionsComponent', () => {
  let component: FamilyActionsComponent;
  let fixture: ComponentFixture<FamilyActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FamilyActionsComponent,
        MockDirective(AddMemberDirective),
        MockDirective(EditFamilyDialogTriggerDirective),
        MockDirective(DeleteFamilyDirective)
      ],
      imports: [MatMenuModule, MatIconModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
