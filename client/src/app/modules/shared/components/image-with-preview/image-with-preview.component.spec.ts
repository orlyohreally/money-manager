import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWithPreviewComponent } from './image-with-preview.component';

describe('ImageWithPreviewComponent', () => {
  let component: ImageWithPreviewComponent;
  let fixture: ComponentFixture<ImageWithPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageWithPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageWithPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
