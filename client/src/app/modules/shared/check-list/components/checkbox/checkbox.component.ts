import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'shared-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  host: {
    class: 'shared-checkbox'
  }
})
export class CheckboxComponent implements OnInit {
  @HostBinding('class.shared-checkbox_checked')
  @Input()
  set checked(newValue: boolean) {
    this._checked = newValue;
    this.changedValue.emit(this._checked);
  }
  get checked(): boolean {
    return this._checked;
  }

  @Output() changedValue = new EventEmitter<boolean>();

  private _checked: boolean;

  constructor() {}

  ngOnInit() {}

  onChecked(event: Event) {
    event.preventDefault();
    this._checked = !this._checked;
    this.changedValue.emit(this._checked);
  }
}
