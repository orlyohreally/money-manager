import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { normalizedArray, normalize } from "@shared/utils";
import { Family } from "@shared/types";

@Injectable({
  providedIn: "root"
})
export class FamiliesService {
  public families: normalizedArray<Family>;
  constructor() {
    this.families = normalize([
      {
        _id: "1",
        name: "Test Family"
      },
      {
        _id: "2",
        name: "Test Family 2"
      }
    ]);
  }

  public getMemberFamilies(): Observable<normalizedArray<Family>> {
    return of(this.families);
  }
}
