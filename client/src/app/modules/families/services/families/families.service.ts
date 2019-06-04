import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { Family } from "@shared/types";
import { HttpClient } from "@angular/common/http";

export type MemberFamily = Family & { roles: string[] };

@Injectable({
  providedIn: "root"
})
export class FamiliesService {
  private families: BehaviorSubject<MemberFamily[]>;
  private dataStore: {
    families: MemberFamily[];
  };

  private familyAPIRouter = "/api/v1/families/";
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

  public create(family: Partial<Family>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .post<Family>("/api/v1/families/", {
          family
        })
        .subscribe(
          newFamily => {
            // FIXME: API should return newFamily with roles
            this.dataStore.families.push(
              Object.assign(newFamily, { roles: ["Owner"] })
            );
            this.families.next(Object.assign({}, this.dataStore).families);
            resolve();
          },
          error => {
            console.log("Could not create family.", error);
            reject(error);
          }
        );
    });
  }

  // public update(family: Family) {
  //   return this.http.put<Family>("/api/v1/families/", family);
  // }

  public getFamily(
    familyId: string
  ): Observable<{ name: string; icon: string; membersCount: number }> {
    return this.http.get<{ name: string; icon: string; membersCount: number }>(
      `/api/v1/families/${familyId}`
    );
  }
}
