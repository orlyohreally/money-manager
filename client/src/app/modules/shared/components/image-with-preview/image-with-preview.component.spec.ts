import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatIconModule } from '@angular/material';
import { MockComponent } from 'ng-mocks';

import { ImageComponent } from '../image/image.component';
import { ImageWithPreviewComponent } from './image-with-preview.component';

describe('ImageWithPreviewComponent', () => {
  let component: ImageWithPreviewComponent;
  let fixture: ComponentFixture<ImageWithPreviewComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [ImageWithPreviewComponent, MockComponent(ImageComponent)],
      imports: [MatIconModule],
      providers: [{ provide: MatDialog, useValue: dialogSpy }]
    }).compileComponents();
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
