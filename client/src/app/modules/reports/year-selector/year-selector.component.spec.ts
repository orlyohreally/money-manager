import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { YearSelectorComponent } from './year-selector.component';

describe('YearSelectorComponent', () => {
  let component: YearSelectorComponent;
  let fixture: ComponentFixture<YearSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YearSelectorComponent],
      imports: [FormsModule, MatSelectModule, NoopAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
