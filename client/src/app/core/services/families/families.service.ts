import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '@core-client/services/global-variables/global-variables.service';
import { findById } from '@shared-client/functions/find-by-id';
import { Family, FamilyView } from '@shared/types';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class FamiliesService extends DataService {
  private familyStore = new BehaviorSubject<{
    families: FamilyView[];
    currentFamily: FamilyView;
  }>({ families: [], currentFamily: undefined });

  private familyAPIRouter = 'families/';
  private familyDefaultIcon = '/assets/images/family-icon.png';
  private loadedFamilies = new BehaviorSubject<boolean>(false);

  constructor(
    http: HttpClient,
    globalVariablesService: GlobalVariablesService
  ) {
    super(http, globalVariablesService);
  }

  loadFamilies(): Observable<FamilyView[]> {
    return this.get(this.familyAPIRouter).pipe(
      map((families: FamilyView[]) => {
        this.familyStore.next({ families, currentFamily: families[0] });
        this.loadedFamilies.next(true);
        return families;
      })
    );
  }

  getFamilyById(familyId: string): Observable<FamilyView> {
    if (this.loadedFamilies.getValue()) {
      return of(findById(this.familyStore.getValue().families, familyId));
    }
    return this.loadFamilies().pipe(
      switchMap(families => {
        return of(findById(families, familyId));
      })
    );
  }

  get familiesInfo(): Observable<{
    families: FamilyView[];
    currentFamily: FamilyView;
  }> {
    if (this.loadedFamilies.getValue()) {
      return this.familyStore.asObservable();
    }
    return this.loadFamilies().pipe(
      switchMap(() => this.familyStore.asObservable())
    );
  }

  setCurrentFamily(familyId: string): void {
    const selectedFamily = findById(
      this.familyStore.getValue().families,
      familyId
    );
    if (selectedFamily) {
      this.familyStore.next({
        families: this.familyStore.getValue().families,
        currentFamily: selectedFamily
      });
    }
  }

  createFamily(
    family: Partial<Family>,
    roles: string[]
  ): Observable<FamilyView> {
    return this.post(this.familyAPIRouter, {
      family,
      roles
    }).pipe(
      switchMap((newFamily: FamilyView) => {
        const families = this.familyStore.getValue().families;
        this.familyStore.next({
          families: [...families, newFamily],
          currentFamily: this.familyStore.getValue().currentFamily
        });
        return of(newFamily);
      })
    );
  }

  updateFamily(
    family: Partial<FamilyView>,
    exchangeRate?: number
  ): Observable<FamilyView> {
    return this.put(`${this.familyAPIRouter}${family._id}`, {
      ...{ family },
      ...(exchangeRate && { exchangeRate })
    }).pipe(
      switchMap((updatedFamily: FamilyView) => {
        const families = this.familyStore
          .getValue()
          .families.map(f => (f._id === family._id ? updatedFamily : f));
        const currentFamily = this.familyStore.getValue().currentFamily;

        this.familyStore.next({
          families,
          currentFamily:
            currentFamily._id === family._id ? updatedFamily : currentFamily
        });
        return of(updatedFamily);
      }),
      switchMap(updatedFamily => {
        if (exchangeRate) {
          if (!exchangeRate || exchangeRate === 1) {
            return of(undefined);
          }
          this.updateMemberFamilySpentAmount(family._id, exchangeRate, '*');
        }
        return of(updatedFamily);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  removeFamily(family: Partial<Family>): Observable<void> {
    return this.delete(`${this.familyAPIRouter}${family._id}`).pipe(
      switchMap(() => {
        const families = this.familyStore.getValue().families;
        const index = families.findIndex(
          (familyIterator: FamilyView) => familyIterator._id === family._id
        );
        families.splice(index, 1);

        this.familyStore.next({
          families,
          currentFamily: this.familyStore.getValue().currentFamily
        });
        return of(undefined);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getFamilyIcon(family: Family) {
    return family.icon ? family.icon : this.familyDefaultIcon;
  }

  getFamiliesList(): Observable<FamilyView[]> {
    return this.familiesInfo.pipe(
      map(
        (familiesInfo: {
          families: FamilyView[];
          currentFamily: FamilyView;
        }) => {
          return familiesInfo.families;
        }
      )
    );
  }

  getFamilyCurrency(familyId: string): Observable<string> {
    return this.getFamiliesList()
      .pipe(
        map((families: Family[]) => {
          const foundFamily = findById(families, familyId);
          return foundFamily ? foundFamily.currency : undefined;
        })
      )
      .pipe();
  }

  updateMemberFamilySpentAmount(familyId: string, k: number, type: '+' | '*') {
    const updateAmount = (amount: number) =>
      type === '+' ? amount + k : amount * k;
    const families = this.familyStore
      .getValue()
      .families.map(f =>
        f._id === familyId ? { ...f, spent: updateAmount(f.spent) } : f
      );
    const currentFamily = this.familyStore.getValue().currentFamily;
    this.familyStore.next({
      families,
      currentFamily:
        currentFamily._id === familyId
          ? { ...currentFamily, spent: updateAmount(currentFamily.spent) }
          : currentFamily
    });
  }
}
