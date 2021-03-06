import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MainNavLogoComponent } from './main-nav-logo.component';

describe('MainNavLogoComponent', () => {
  let component: MainNavLogoComponent;
  let fixture: ComponentFixture<MainNavLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainNavLogoComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
