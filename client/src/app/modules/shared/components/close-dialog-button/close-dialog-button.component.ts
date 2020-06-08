import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shared-close-dialog-button',
  templateUrl: './close-dialog-button.component.html',
  styleUrls: ['./close-dialog-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloseDialogButtonComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
