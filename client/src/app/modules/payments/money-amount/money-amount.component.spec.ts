import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAmountComponent } from './money-amount.component';

describe('MoneyAmountComponent', () => {
  let component: MoneyAmountComponent;
  let fixture: ComponentFixture<MoneyAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoneyAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
