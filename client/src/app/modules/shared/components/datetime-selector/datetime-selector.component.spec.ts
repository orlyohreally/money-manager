import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DatetimeSelectorComponent } from './datetime-selector.component';

describe('DatetimeSelectorComponent', () => {
  let component: DatetimeSelectorComponent;
  let fixture: ComponentFixture<DatetimeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatetimeSelectorComponent],
      imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatInputModule,
        NoopAnimationsModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
