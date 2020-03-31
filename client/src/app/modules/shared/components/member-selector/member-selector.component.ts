import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { FormControl } from '@angular/forms';
import { FamilyMember } from '@shared/types';
import { EMPTY, Subject, timer } from 'rxjs';
import { debounce, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'shared-member-selector',
  templateUrl: './member-selector.component.html',
  styleUrls: ['./member-selector.component.scss']
})
export class MemberSelectorComponent implements OnInit, OnDestroy {
  @Input() members: FamilyMember[];
  @Input() selectorLabel: string;
  @Input() defaultMemberId: string;
  @Input() required: boolean;
  @Input() debounceTime: number;

  @Output() memberSelected = new EventEmitter<string>();

  selectedMember: FormControl;

  private destroyed = new Subject<void>();

  constructor() {}

  ngOnInit() {
    this.selectedMember = new FormControl(this.defaultMemberId);
    this.selectedMember.valueChanges
      .pipe(
        startWith(this.selectedMember.value),
        takeUntil(this.destroyed),
        debounce(() => (this.debounceTime ? timer(this.debounceTime) : EMPTY))
      )
      .subscribe(() => {
        if (this.selectedMember.valid) {
          this.memberSelected.emit(this.selectedMember.value);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
