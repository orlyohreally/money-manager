import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { NotificationMessageComponent } from './notification-message.component';

@Component({
  template: `
    <shared-notification-message [type]="type"
      ><h1>Message</h1></shared-notification-message
    >
  `
})
class TestComponent {
  type: string;
}

describe('ErrorMessageComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationMessageComponent, TestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    'should display block with class ' +
      '.notification-message.notification-message_info when type is info',
    () => {
      component.type = 'info';
      fixture.detectChanges();
      const notificationEl: HTMLElement = fixture.nativeElement.querySelector(
        '.notification-message'
      );
      expect(notificationEl.innerHTML).toBe('<h1>Message</h1>');
      expect(notificationEl.textContent.trim()).toBe('Message');
      expect(notificationEl).toBeTruthy();
      expect(
        notificationEl.classList.contains('notification-message_info')
      ).toBeTruthy();
      expect(
        notificationEl.classList.contains('notification-message_error')
      ).toBeFalsy();
      expect(
        notificationEl.classList.contains('notification-message_success')
      ).toBeFalsy();
    }
  );

  it(
    'should display block with class' +
      ' .notification-message.notification-message_info when type is not set',
    () => {
      const notificationEl: HTMLElement = fixture.nativeElement.querySelector(
        '.notification-message'
      );
      expect(notificationEl).toBeTruthy();
      expect(notificationEl.innerHTML).toBe('<h1>Message</h1>');
      expect(notificationEl.textContent.trim()).toBe('Message');
      expect(
        notificationEl.classList.contains('notification-message_info')
      ).toBeTruthy();
      expect(
        notificationEl.classList.contains('notification-message_error')
      ).toBeFalsy();
      expect(
        notificationEl.classList.contains('notification-message_success')
      ).toBeFalsy();
    }
  );

  it(
    'should display block with class' +
      ' .notification-message.notification-message_error when type is error',
    () => {
      component.type = 'error';
      fixture.detectChanges();
      const notificationEl: HTMLElement = fixture.nativeElement.querySelector(
        '.notification-message'
      );
      expect(notificationEl).toBeTruthy();
      expect(notificationEl.innerHTML).toBe('<h1>Message</h1>');
      expect(notificationEl.textContent.trim()).toBe('Message');
      expect(
        notificationEl.classList.contains('notification-message_info')
      ).toBeFalsy();
      expect(
        notificationEl.classList.contains('notification-message_error')
      ).toBeTruthy();
      expect(
        notificationEl.classList.contains('notification-message_success')
      ).toBeFalsy();
    }
  );

  it(
    'should display block with class' +
      ' .notification-message.notification-message_success' +
      ' when type is success',
    () => {
      component.type = 'success';
      fixture.detectChanges();
      const notificationEl: HTMLElement = fixture.nativeElement.querySelector(
        '.notification-message'
      );
      expect(notificationEl).toBeTruthy();
      expect(notificationEl.innerHTML).toBe('<h1>Message</h1>');
      expect(notificationEl.textContent.trim()).toBe('Message');
      expect(
        notificationEl.classList.contains('notification-message_info')
      ).toBeFalsy();
      expect(
        notificationEl.classList.contains('notification-message_error')
      ).toBeFalsy();
      expect(
        notificationEl.classList.contains('notification-message_success')
      ).toBeTruthy();
    }
  );
});
