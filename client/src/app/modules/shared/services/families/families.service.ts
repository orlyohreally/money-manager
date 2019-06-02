import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { Family } from "@shared/types";
import { HttpClient } from "@angular/common/http";

export type memberFamily = Family & { roles: string[] };

@Injectable({
  providedIn: "root"
})
export class FamiliesService {
  private families: BehaviorSubject<memberFamily[]>;
  private dataStore: {
    families: memberFamily[];
  };
  private familyAPIRouter = "/api/v1/families/";
  constructor(private http: HttpClient) {
    console.log("FamiliesService is working");
    this.families = <BehaviorSubject<memberFamily[]>>new BehaviorSubject([]);
    this.dataStore = { families: null };

    this.loadFamilies().then((data: memberFamily[]) => {
      console.log("families are loaded");
      this.dataStore.families = data;
      this.families.next(Object.assign({}, this.dataStore).families);
    });
  }

  public async loadFamilies(): Promise<memberFamily[]> {
    return new Promise((resolve, reject) => {
      this.http.get(this.familyAPIRouter).subscribe(
        (data: memberFamily[]) => {
          resolve(data);
        },
        (error: Error) => {
          console.log("Could not load families.", error);
          reject(error);
        }
      );
    });
  }

  get membersFamilies(): Observable<memberFamily[]> {
    return this.families.asObservable();
  }

  public create(family: Partial<Family>): Promise<void> {
    console.log("create", family);
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
