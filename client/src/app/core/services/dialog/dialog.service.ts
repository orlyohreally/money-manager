import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private defaultConfig: MatDialogConfig = {
    width: '60%',
    maxHeight: '80%',
    maxWidth: '700px',
    minWidth: '300px',
    restoreFocus: false,
    panelClass: ['dialog_scrollable']
  };
  private fullScreenClass = 'dialog_full-screen';

  constructor(
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {}
  open<S, T>(
    componentOrTemplateRef: ComponentType<S> | TemplateRef<S>,
    config?: MatDialogConfig<T>,
    responsive: boolean = true
  ): MatDialogRef<S> {
    const defaultPanelClasses = this.defaultConfig.panelClass as string[];

    const dialogRef = this.dialog.open(componentOrTemplateRef, {
      ...this.defaultConfig,
      ...(config && {
        ...config,
        ...(config.panelClass && {
          panelClass:
            typeof config.panelClass === 'string'
              ? [...defaultPanelClasses, config.panelClass]
              : [...defaultPanelClasses, ...config.panelClass]
        })
      })
    });

    if (responsive) {
      const subs = this.breakpointObserver
        .observe(Breakpoints.XSmall)
        .subscribe(result => {
          if (result.matches) {
            dialogRef.addPanelClass(this.fullScreenClass);
          } else {
            dialogRef.removePanelClass(this.fullScreenClass);
          }
        });
      dialogRef.afterClosed().subscribe(() => {
        subs.unsubscribe();
      });
    }
    return dialogRef;
  }
}
