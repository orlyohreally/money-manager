import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { CurrencyService } from '@core-client/services/currency/currency.service';
import { Currency } from '@src/app/types/currency';
import { CurrencySymbolPipe } from '../../pipes/currency-symbol.pipe';

@Component({
  selector: 'shared-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['./currency-selector.component.scss']
})
export class CurrencySelectorComponent implements OnInit, OnDestroy {
  @Input() defaultCurrency: string;
  @Input() required: boolean;
  @Input() selectorLabel: string;

  @Output() currencySelected = new EventEmitter<string>();

  currencyControl: FormControl;
  currencyList: Currency[];
  searchKeyWord: FormControl = new FormControl();
  filteredCurrencies: Observable<Currency[]>;

  private destroyed = new Subject<void>();

  constructor(
    private currencyService: CurrencyService,
    private currencySymbol: CurrencySymbolPipe
  ) {}

  ngOnInit() {
    this.currencyList = this.currencyService.getCurrencies();
    this.currencyControl = new FormControl(this.defaultCurrency);

    this.filteredCurrencies = this.searchKeyWord.valueChanges.pipe(
      startWith(this.searchKeyWord.value),
      takeUntil(this.destroyed),
      map(() => this.filterCurrencies())
    );

    this.currencyControl.valueChanges
      .pipe(startWith(this.currencyControl.value), takeUntil(this.destroyed))
      .subscribe(() => {
        this.currencySelected.emit(this.currencyControl.value);
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  protected filterCurrencies(): Currency[] {
    if (!this.currencyList) {
      return [];
    }

    if (!this.searchKeyWord.value) {
      return [...this.currencyList];
    }

    const searchKeyWord = this.searchKeyWord.value.toLowerCase();
    return this.currencyList.filter(
      currencyOption =>
        currencyOption.currency.toLowerCase().indexOf(searchKeyWord) > -1 ||
        currencyOption.symbol.toLowerCase().indexOf(searchKeyWord) > -1 ||
        this.currencySymbol
          .transform(currencyOption.symbol, 'narrow')
          .indexOf(searchKeyWord) > -1
    );
  }
}
