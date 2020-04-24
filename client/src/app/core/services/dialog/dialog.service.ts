import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  private defaultConfig: MatDialogConfig = {
    width: '60%',
    maxHeight: '80%',
    maxWidth: '700px',
    minWidth: '300px',
    restoreFocus: false,
    panelClass: ['dialog_scrollable']
  };

  open<S, T>(
    componentOrTemplateRef: ComponentType<S> | TemplateRef<S>,
    config?: MatDialogConfig<T>
  ) {
    const defaultPanelClasses = this.defaultConfig.panelClass as string[];
    this.dialog.open(componentOrTemplateRef, {
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
  }
}
