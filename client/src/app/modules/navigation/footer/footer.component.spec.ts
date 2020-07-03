import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { ContactFormComponent } from '@shared-client/components/contact-form/contact-form.component';
import { IsDevModeService } from '@src/app/core/services/is-dev-mode.service';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent, MockComponent(ContactFormComponent)],
      imports: [FlexLayoutModule],
      providers: [
        { provide: IsDevModeService, useValue: { isDevMode: () => false } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
