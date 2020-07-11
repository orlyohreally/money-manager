import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'reports-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.scss']
})
export class MonthSelectorComponent implements OnInit {
  @Output() monthSet = new EventEmitter<number>();

  months: number[];
  selectedMonth: number;

  constructor() {}

  ngOnInit(): void {
    this.selectedMonth = new Date().getMonth();
    this.onMonthChange(this.selectedMonth);
  }

  onMonthChange(month: number) {
    this.monthSet.emit(month);
  }
}
