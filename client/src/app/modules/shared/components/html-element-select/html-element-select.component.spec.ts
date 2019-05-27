import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlElementSelectComponent } from './html-element-select.component';

describe('HtmlElementSelectComponent', () => {
  let component: HtmlElementSelectComponent;
  let fixture: ComponentFixture<HtmlElementSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlElementSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlElementSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
