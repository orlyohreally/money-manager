import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MainNavLogoComponent } from "./main-nav-log.component";

describe("MainNavLogoComponent", () => {
  let component: MainNavLogoComponent;
  let fixture: ComponentFixture<MainNavLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainNavLogoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
