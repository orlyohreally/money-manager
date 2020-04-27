import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { MenuEntry, MenuEntryComponent } from './menu-entry.component';

@Component({
  template: `
    <shared-menu-entry [entry]="entry"></shared-menu-entry>
  `
})
class ParentComponent {
  entry: MenuEntry;

  @ViewChild(MenuEntryComponent)
  MenuEntryComponent: MenuEntryComponent;
}

describe('MenuEntryComponent', () => {
  let component: MenuEntryComponent;
  let parentComponent: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuEntryComponent, ParentComponent],
      imports: [MatMenuModule, MatIconModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    parentComponent = fixture.componentInstance;
    parentComponent.entry = {
      icon: 'icon-1',
      link: 'link-1',
      label: 'label-1'
    };
    fixture.detectChanges();
    component = parentComponent.MenuEntryComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
