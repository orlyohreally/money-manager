import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { LoaderComponent } from '../loader/loader.component';
import { ContentWithLoaderComponent } from './content-with-loader.component';

describe('ContentWithLoaderComponent', () => {
  let component: ContentWithLoaderComponent;
  let fixture: ComponentFixture<ContentWithLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentWithLoaderComponent, MockComponent(LoaderComponent)]
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
