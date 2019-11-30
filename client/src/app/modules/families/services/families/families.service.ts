import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { Family } from '@shared/types';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { MemberFamily } from 'src/app/modules/shared/types/member-family';

@Injectable({
  providedIn: 'root'
})
export class FamiliesService {
  private familyStore = new BehaviorSubject<{
    families: MemberFamily[];
    currentFamily: MemberFamily;
  }>({ families: [], currentFamily: null });
  private familyAPIRouter = '/api/v1/families/';

  constructor(private http: HttpClient) {
    // this.loadFamilies();
  }

  public loadFamilies(): Observable<void> {
    return this.http.get(this.familyAPIRouter).pipe(
      switchMap(
        (families: MemberFamily[]) => {
          this.familyStore.next({ families, currentFamily: families[0] });
          return of(undefined);
        },
        error => {
          console.log(error);
          throwError(error);
        }
      )
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

  public createFamily(family: Partial<Family>): Observable<MemberFamily> {
    return this.http
      .post<Family>('/api/v1/families/', {
        family
      })
      .pipe(
        switchMap((newFamily: MemberFamily) => {
          const families = this.familyStore.getValue().families;
          this.familyStore.next({
            families: [...families, newFamily],
            currentFamily: this.familyStore.getValue().currentFamily
          });
          return of(newFamily);
        }),
        catchError(error => {
          console.log('Could not create family.', error);
          return throwError(error);
        })
      );
  }

  public updateFamily(family: Partial<Family>): Observable<MemberFamily> {
    return this.http
      .put<Family>(`/api/v1/families/${family._id}`, { family })
      .pipe(
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
          console.log('error', error);
          return throwError(error);
        })
      );
  }

  public removeFamily(family: Partial<Family>): Observable<void> {
    return this.http.delete(`/api/v1/families/${family._id}`).pipe(
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
        console.log('Could not remove family.', error);
        return throwError(error);
      })
    );
  }

  public getFamily(
    familyId: string
  ): Observable<{ name: string; icon: string; membersCount: number }> {
    return this.http.get<{ name: string; icon: string; membersCount: number }>(
      `/api/v1/families/${familyId}`
    );
  }
}
