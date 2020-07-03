import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { SupportService } from '@core-client/services/support/support.service';
import { RecaptchaComponent } from 'ng-recaptcha';
// tslint:disable-next-line: max-line-length
import { NotificationBlockDirective } from '../../directives/notification-block.directive';
// tslint:disable-next-line: max-line-length
import { ContentWithLoaderComponent } from '../content-with-loader/content-with-loader.component';
import { ContactFormComponent } from './contact-form.component';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let supportServiceSpy: jasmine.SpyObj<SupportService>;

  beforeEach(async(() => {
    supportServiceSpy = jasmine.createSpyObj('SupportService', [
      'contactSupport'
    ]);
    supportServiceSpy.contactSupport.and.returnValue(
      of({ message: 'Contacted' })
    );

    TestBed.configureTestingModule({
      declarations: [
        ContactFormComponent,
        MockComponent(ContentWithLoaderComponent),
        MockDirective(NotificationBlockDirective),
        MockComponent(RecaptchaComponent)
      ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [{ provide: SupportService, useValue: supportServiceSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
