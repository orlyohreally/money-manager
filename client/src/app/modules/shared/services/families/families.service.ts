import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { normalizedArray, normalize } from "@shared/utils";
import { Family } from "@shared/types";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class FamiliesService {
  private families: BehaviorSubject<Family[]>;
  private dataStore: {
    families: Family[];
  };
  private familyAPIRouter = "/api/v1/families/";
  constructor(private http: HttpClient) {
    console.log("FamiliesService is working");
    this.families = <BehaviorSubject<Family[]>>new BehaviorSubject([]);
    this.dataStore = { families: [] };
  }

  // public async loadUserFamilies(): Promise<Family[]> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get<Family[]>(this.familyAPIRouter).subscribe(
  //       (families: Family[]) => {
  //         this.families = families;
  //         console.log("FamiliesService: loaded", families);
  //         resolve(this.families);
  //       },
  //       error => {
  //         console.log(error);
  //         reject(error);
  //       }
  //     );
  //   });
  // }

  loadFamilies() {
    this.http.get(this.familyAPIRouter).subscribe(
      (data: Family[]) => {
        this.dataStore.families = data;
        this.families.next(Object.assign({}, this.dataStore).families);
      },
      (error: Error) => console.log("Could not load families.")
    );
  }

  get membersFamilies(): Observable<Family[]> {
    return this.families.asObservable();
  }

  // public create(family: Partial<Family>): Observable<Family> {
  //   return this.http.post<Family>("/api/v1/families/", {
  //     family,
  //     userId: "5ce668811560500ebce13898"
  //   });
  // }

  public create(family: Partial<Family>): Promise<void> {
    console.log("create", family);
    return new Promise((resolve, reject) => {
      this.http
        .post<Family>("/api/v1/families/", {
          family,
          userId: "5ce668811560500ebce13898"
        })
        .subscribe(
          newFamily => {
            this.dataStore.families.push(newFamily);
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
}
