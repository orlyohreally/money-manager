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
import { PaymentSubject } from '@shared/types';
import { EMPTY, Subject, timer } from 'rxjs';
import { debounce, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'shared-payment-subject-selector',
  templateUrl: './payment-subject-selector.component.html',
  styleUrls: ['./payment-subject-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentSubjectSelectorComponent implements OnInit, OnDestroy {
  @Input() subjects: PaymentSubject[];
  @Input() selectorLabel: string;
  @Input() required: boolean;
  @Input() defaultSubjectId: string;
  @Input() debounceTime: number;

  @Output() subjectSelected = new EventEmitter<string>();

  selectedSubject: FormControl;

  private destroyed = new Subject<void>();

  constructor() {}

  ngOnInit() {
    this.selectedSubject = new FormControl(this.defaultSubjectId);
    this.selectedSubject.valueChanges
      .pipe(
        startWith(this.selectedSubject.value),
        takeUntil(this.destroyed),
        debounce(() => (this.debounceTime ? timer(this.debounceTime) : EMPTY))
      )
      .subscribe(() => {
        if (this.selectedSubject.valid) {
          this.subjectSelected.emit(this.selectedSubject.value);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
