import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { AvatarComponent } from '@shared-client/components/avatar/avatar.component';
import { FamilyView } from '@shared/types';
import {
  FamiliesServiceMock,
  PrefixedNumberPipeMock
} from '@tests-utils/mocks';
import { FamilyIconPipeMock } from '@tests-utils/mocks/family-icon.pipe.spec';
// tslint:disable-next-line: max-line-length
import { EditFamilyDialogTriggerDirective } from '../directives/edit-family-dialog-trigger/edit-family-dialog-trigger.directive';
import { FamilyCardComponent } from './family-card.component';

@Component({
  template: `
    <family-card [family]="family"></family-card>
  `
})
class ParentComponent {
  family: FamilyView;

  @ViewChild(FamilyCardComponent) familyCardComponent: FamilyCardComponent;
}

describe('FamilyCardComponent', () => {
  let component: FamilyCardComponent;
  let parentComponent: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  const familiesServiceMock = FamiliesServiceMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FamilyCardComponent,
        ParentComponent,
        FamilyIconPipeMock,
        MockDirective(EditFamilyDialogTriggerDirective),
        MockDirective(AvatarComponent),
        PrefixedNumberPipeMock
      ],
      imports: [MatMenuModule, MatIconModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    parentComponent = fixture.componentInstance;
    parentComponent.family = familiesServiceMock.memberFamilies[0];
    fixture.detectChanges();
    component = parentComponent.familyCardComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
