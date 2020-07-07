import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'reports-year-selector',
  templateUrl: './year-selector.component.html',
  styleUrls: ['./year-selector.component.scss']
})
export class YearSelectorComponent implements OnInit {
  @Output() yearSet = new EventEmitter<number>();

  years: number[];
  selectedYear: number;
  private minYear = 2019;

  constructor() {}

  ngOnInit(): void {
    this.selectedYear = new Date().getFullYear();
    this.onYearChange(this.selectedYear);

    this.years = Array.from(
      Array(new Date().getFullYear() - this.minYear + 1),
      (_, i) => i + this.minYear
    );
  }

  onYearChange(year: number) {
    this.yearSet.emit(year);
  }
}
