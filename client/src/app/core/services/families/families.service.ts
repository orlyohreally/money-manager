import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Family } from '@shared/types';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MemberFamily } from 'src/app/modules/shared/types/member-family';
import { DataService } from '../data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';

export interface FamilyView {
  name: string;
  icon: string;
  membersCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FamiliesService extends DataService {
  private familyStore = new BehaviorSubject<{
    families: MemberFamily[];
    currentFamily: MemberFamily;
  }>({ families: [], currentFamily: null });

  private familyAPIRouter = 'families/';
  private familyDefaultIcon = '/assets/images/family-icon.png';

  constructor(
    http: HttpClient,
    globalVariablesService: GlobalVariablesService
  ) {
    super(http, globalVariablesService);
  }

  loadFamilies(): Observable<MemberFamily[]> {
    return this.get(this.familyAPIRouter).pipe(
      map((families: MemberFamily[]) => {
        this.familyStore.next({ families, currentFamily: families[0] });
        return families;
      })
    );
  }

  getFamilyById(familyId: string): Observable<MemberFamily> {
    if (this.familyStore.getValue().families) {
      return of(
        this.familyStore
          .getValue()
          .families.filter(family => family._id === familyId)[0]
      );
    }

    return this.loadFamilies().pipe(
      switchMap(families => {
        return of(families.filter(family => family._id === familyId)[0]);
      })
    );
  }

  get familiesInfo(): Observable<{
    families: MemberFamily[];
    currentFamily: MemberFamily;
  }> {
    return this.familyStore.asObservable();
  }

  setCurrentFamily(familyId: string) {
    const selectedFamily = this.familyStore
      .getValue()
      .families.filter((family: MemberFamily) => family._id === familyId)[0];
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
  ): Observable<MemberFamily> {
    return this.post(this.familyAPIRouter, {
      family,
      roles
    }).pipe(
      switchMap((newFamily: MemberFamily) => {
        const families = this.familyStore.getValue().families;
        this.familyStore.next({
          families: [...families, newFamily],
          currentFamily: this.familyStore.getValue().currentFamily
        });
        return of(newFamily);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  updateFamily(family: Partial<MemberFamily>): Observable<MemberFamily> {
    return this.put(`${this.familyAPIRouter}${family._id}`, { family }).pipe(
      switchMap((updatedFamily: MemberFamily) => {
        const families = this.familyStore.getValue().families;
        let oldFamilyValue = families.filter(
          (currentFamily: MemberFamily) =>
            currentFamily._id === updatedFamily._id
        )[0];
        oldFamilyValue = Object.assign(oldFamilyValue, updatedFamily);
        this.familyStore.next({
          families,
          currentFamily: this.familyStore.getValue().currentFamily
        });
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
          (familyIterator: MemberFamily) => familyIterator._id === family._id
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

  getFamily(familyId: string): Observable<FamilyView> {
    return this.get<{ name: string; icon: string; membersCount: number }>(
      `${this.familyAPIRouter}${familyId}`
    );
  }

  getFamilyIcon(family: Family) {
    return family.icon ? family.icon : this.familyDefaultIcon;
  }

  getFamiliesList(): Observable<Family[]> {
    return this.familiesInfo.pipe(
      map(
        (familiesInfo: {
          families: MemberFamily[];
          currentFamily: MemberFamily;
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
          const foundFamily = families.filter(
            family => family._id === familyId
          );
          return foundFamily.length ? foundFamily[0].currency : null;
        })
      )
      .pipe();
  }
}
