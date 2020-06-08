import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { debounce, map, startWith, takeUntil } from 'rxjs/operators';

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
  @Input() color: string;
  @Input() enableMeridian: boolean;
  @Input() disableMinute: boolean;
  @Input() hideTime: boolean;
  @Input() inputName: string;

  @Output() dateSelected = new EventEmitter<Date>();

  selectedDate: FormControl;
  smallScreen: Observable<boolean>;

  private destroyed = new Subject<void>();

  constructor(private breakpointObserver: BreakpointObserver) {}

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

    this.smallScreen = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .pipe(map(response => response.matches));
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
