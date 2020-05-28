import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Subject, timer } from 'rxjs';
import { debounce, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'shared-datetime-selector',
  templateUrl: './datetime-selector.component.html',
  styleUrls: ['./datetime-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatetimeSelectorComponent implements OnInit, OnDestroy {
  @Input() selectorLabel: string;
  @Input() defaultDate: Date;
  @Input() minDate: Date;
  @Input() required: boolean;
  @Input() debounceTime: number;
  @Input() showSpinners: boolean;
  @Input() showSeconds: boolean;
  @Input() stepHour: number;
  @Input() stepMinute: number;
  @Input() stepSecond: number;
  @Input() touchUi: boolean;
  @Input() color: string;
  @Input() enableMeridian: boolean;
  @Input() disableMinute: boolean;
  @Input() hideTime: boolean;
  @Input() inputName: string;

  @Output() dateSelected = new EventEmitter<Date>();

  selectedDate: FormControl;

  private destroyed = new Subject<void>();

  constructor() {}

  ngOnInit() {
    this.selectedDate = new FormControl(this.defaultDate || null);
    this.selectedDate.valueChanges
      .pipe(
        startWith(this.selectedDate.value),
        takeUntil(this.destroyed),
        debounce(() => (this.debounceTime ? timer(this.debounceTime) : EMPTY))
      )
      .subscribe(() => {
        if (!this.selectedDate.valid) {
          let defaultValidDate: Date;
          if (this.minDate) {
            defaultValidDate = new Date(this.minDate);
            defaultValidDate.setDate(defaultValidDate.getDate() + 1);
          } else {
            defaultValidDate = new Date();
          }
          this.selectedDate.setValue(defaultValidDate, { emitEvent: false });
        }
        const date = new Date(this.selectedDate.value);
        this.dateSelected.emit(date);
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
