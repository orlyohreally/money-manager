import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

// tslint:disable-next-line: max-line-length
import { CurrencyService } from '@core-client/services/currency/currency.service';
import {
  CurrencySymbolPipeMock,
  getCurrencyServiceSpy
} from '@tests-utils/mocks';
import { CurrencySymbolPipe } from '../../pipes/currency-symbol.pipe';
import { CurrencySelectorComponent } from './currency-selector.component';

describe('CurrencySelectorComponent', () => {
  let component: CurrencySelectorComponent;
  let fixture: ComponentFixture<CurrencySelectorComponent>;
  let currencyServiceSpy: jasmine.SpyObj<CurrencyService>;
  let currencySymbolPipeSpy: jasmine.SpyObj<CurrencySymbolPipe>;

  beforeEach(async(() => {
    currencyServiceSpy = getCurrencyServiceSpy();
    // tslint:disable-next-line: max-line-length
    currencySymbolPipeSpy = jasmine.createSpyObj('CurrencySymbol', [
      'transform'
    ]);
    currencySymbolPipeSpy.transform.and.callFake(
      new CurrencySymbolPipeMock().transform
    );

    TestBed.configureTestingModule({
      declarations: [CurrencySelectorComponent, CurrencySymbolPipeMock],
      imports: [
        NgxMatSelectSearchModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CurrencySymbolPipe, useValue: currencySymbolPipeSpy },
        { provide: CurrencyService, useValue: currencyServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
