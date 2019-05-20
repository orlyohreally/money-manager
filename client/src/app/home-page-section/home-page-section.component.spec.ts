import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HomePageSectionComponent } from "./home-page-section.component";

describe("HomePageSectionComponent", () => {
  let component: HomePageSectionComponent;
  let fixture: ComponentFixture<HomePageSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePageSectionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
