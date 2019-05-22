import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MenuEntryComponent } from "./menu-entry.component";

describe("MainMenuEntryComponent", () => {
  let component: MenuEntryComponent;
  let fixture: ComponentFixture<MenuEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuEntryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
