import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuEntryComponent } from './main-menu-entry.component';

describe('MainMenuEntryComponent', () => {
  let component: MainMenuEntryComponent;
  let fixture: ComponentFixture<MainMenuEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainMenuEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
