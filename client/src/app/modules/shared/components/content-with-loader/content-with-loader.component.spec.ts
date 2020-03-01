import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentWithLoaderComponent } from './content-with-loader.component';

describe('ContentWithLoaderComponent', () => {
  let component: ContentWithLoaderComponent;
  let fixture: ComponentFixture<ContentWithLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentWithLoaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentWithLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
