import { Injectable } from "@angular/core";
import { User as Member } from "@shared/types";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MembersService {
  constructor() {}
  public getMembers(): Observable<Member[]> {
    return of([]);
  }

  public getColorSchemes() {
    return ["primary", "accent", "purple"];
  }

  public getMemberFullName(member: Member) {
    return `${member.firstName} ${member.lastName}`;
  }
}
