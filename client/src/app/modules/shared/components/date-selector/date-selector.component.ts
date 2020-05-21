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
  selector: 'shared-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateSelectorComponent implements OnInit, OnDestroy {
  @Input() selectorLabel: string;
  @Input() defaultDate: Date;
  @Input() minDate: Date;
  @Input() required: boolean;
  @Input() debounceTime: number;

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
        date.setHours(0, 0, 0, 0);
        this.dateSelected.emit(date);
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
