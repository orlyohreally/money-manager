import { Injectable } from '@angular/core';
import { Member } from '@shared/types/member';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor() {}

  public getMember(): Member {
    return {
      _id: '2',
      firstName: 'Orly',
      lastName: 'Knop',
      colorScheme: 'accent'
    };
  }
}
