import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';

import { DialogService } from './dialog.service';

@Component({})
class DummyComponent {}

describe('DialogService', () => {
  let service: DialogService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;

  const defaultConfig: MatDialogConfig & { panelClass?: string[] } = {
    width: '60%',
    maxHeight: '80%',
    maxWidth: '700px',
    minWidth: '300px',
    restoreFocus: false,
    panelClass: ['dialog_scrollable']
  };

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({
      afterClosed: () => cold('-----------a', { a: undefined }),
      addPanelClass: () => {},
      removePanelClass: () => {}
    });

    breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', [
      'observe'
    ]);
    breakpointObserverSpy.observe.and.returnValue(
      hot('--^a--b--c|', {
        a: { matches: true },
        b: { matches: false },
        c: { matches: true }
      })
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy }
      ]
    });
    service = TestBed.get(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(
    'should call dialog open with default config' + ' when config are not set',
    () => {
      service.open(DummyComponent);
      expect(dialogSpy.open).toHaveBeenCalledTimes(1);
      expect(dialogSpy.open).toHaveBeenCalledWith(
        DummyComponent,
        defaultConfig
      );
    }
  );

  it(
    'should call dialog open with default config and not default width' +
      ' when config  is {width: "50%"}',
    () => {
      service.open(DummyComponent, { width: '50%' });
      expect(dialogSpy.open).toHaveBeenCalledTimes(1);
      expect(dialogSpy.open).toHaveBeenCalledWith(DummyComponent, {
        ...defaultConfig,
        width: '50%'
      });
    }
  );

  it(
    'should call dialog open with combined default panelClass and the set one' +
      ' when config  is {width: "50%", panelClass: "panel-class"}',
    () => {
      service.open(DummyComponent, { width: '50%', panelClass: 'panel-class' });
      expect(dialogSpy.open).toHaveBeenCalledTimes(1);
      expect(dialogSpy.open).toHaveBeenCalledWith(DummyComponent, {
        ...defaultConfig,
        panelClass: [...defaultConfig.panelClass, 'panel-class'],
        width: '50%'
      });
    }
  );

  it(
    'should call dialog open with combined default panelClass and the set one' +
      ' when config  is {panelClass: ["panel-class-1", "panel-class-2"]}',
    () => {
      service.open(DummyComponent, {
        width: '50%',
        panelClass: ['panel-class-1', 'panel-class-2']
      });
      expect(dialogSpy.open).toHaveBeenCalledTimes(1);
      expect(dialogSpy.open).toHaveBeenCalledWith(DummyComponent, {
        ...defaultConfig,
        panelClass: [
          ...defaultConfig.panelClass,
          'panel-class-1',
          'panel-class-2'
        ],
        width: '50%'
      });
    }
  );

  it(
    'should call dialogRef.addPanelClass and dialogRef.removePanelClass' +
      ' depending on width when responsive is true',
    () => {
      const dialogRef = service.open(DummyComponent, {
        width: '50%',
        panelClass: ['panel-class-1', 'panel-class-2']
      });

      spyOn(dialogRef, 'addPanelClass');
      spyOn(dialogRef, 'removePanelClass');
      getTestScheduler().flush();
      const responsiveClass = 'dialog_full-screen';
      expect(dialogRef.addPanelClass).toHaveBeenCalledTimes(2);
      expect(dialogRef.addPanelClass).toHaveBeenCalledWith(responsiveClass);
      expect(dialogRef.removePanelClass).toHaveBeenCalledTimes(1);
      expect(dialogRef.removePanelClass).toHaveBeenCalledWith(responsiveClass);
    }
  );
});
