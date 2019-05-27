import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { normalizedArray, normalize } from "@shared/utils";
import { Family } from "@shared/types";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class FamiliesService {
  public families: normalizedArray<Family>;
  constructor(private http: HttpClient) {}

  public getMemberFamilies(): Observable<normalizedArray<Family>> {
    return of(this.families);
  }

  public create(family: Partial<Family>): Observable<Family> {
    return this.http.post<Family>("/api/v1/families/", {
      family,
      userId: "5ce668811560500ebce13898"
    });
  }

  public update(family: Family) {
    return this.http.put<Family>("/api/v1/families/", family);
  }
}
