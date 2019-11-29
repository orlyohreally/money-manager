import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { Family } from '@shared/types';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';

export type MemberFamily = Family & { roles: string[] };

@Injectable({
  providedIn: 'root'
})
export class FamiliesService {
  private families: BehaviorSubject<MemberFamily[]>;
  private dataStore: {
    families: MemberFamily[];
  };

  private familyAPIRouter = '/api/v1/families/';
  constructor(private http: HttpClient) {
    this.families = <BehaviorSubject<MemberFamily[]>>new BehaviorSubject([]);
    this.dataStore = { families: null };
    this.loadFamilies();
  }

  public loadFamilies(): void {
    this.http.get(this.familyAPIRouter).subscribe(
      (families: MemberFamily[]) => {
        this.dataStore.families = families;
        this.families.next(Object.assign({}, this.dataStore).families);
      },
      error => {
        console.log(error);
      }
    );
  }

  get membersFamilies(): Observable<MemberFamily[]> {
    return this.families.asObservable();
  }

  public createFamily(family: Partial<Family>): Observable<void> {
    return this.http
      .post<Family>('/api/v1/families/', {
        family
      })
      .pipe(
        switchMap(newFamily => {
          this.dataStore.families.push(
            Object.assign(newFamily, { roles: ['Owner'] })
          );
          this.families.next(Object.assign({}, this.dataStore).families);
          return of(undefined);
        }),
        catchError(error => {
          console.log('Could not create family.', error);
          return throwError(error);
        })
      );
  }

  public updateFamily(family: MemberFamily): Observable<void> {
    return this.http
      .put<Family>(`/api/v1/families/${family._id}`, { family })
      .pipe(
        switchMap(() => {
          this.dataStore.families.forEach((f, i) => {
            console.log(f, i, f._id, family._id);
            if (f._id === family._id) {
              this.dataStore.families[i] = family;
            }
          });
          this.families.next(Object.assign({}, this.dataStore).families);
          return of(undefined);
        }),
        catchError(error => {
          console.log(error);
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
