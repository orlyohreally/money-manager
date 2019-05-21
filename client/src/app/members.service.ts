import { Injectable } from "@angular/core";
import { User as Member } from "@shared/types";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MembersService {
  constructor() {}
  public getMembers(): Observable<Member[]> {
    return of([
      {
        _id: "1",
        firstName: "Alex",
        lastName: "Zinkevich",
        colorScheme: "primary"
      },
      {
        _id: "2",
        firstName: "Orly",
        lastName: "Knop",
        colorScheme: "accent"
      },
      {
        _id: "5",
        firstName: "anonymous",
        lastName: "anonymous",
        colorScheme: "accent"
      }
    ]);
  }

  public getColorSchemes() {
    return ["primary", "accent", "purple"];
  }
}
