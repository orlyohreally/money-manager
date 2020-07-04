import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: matSnackBarSpy }]
    });

    service = TestBed.get(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
