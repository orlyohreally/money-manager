import { Injectable } from '@angular/core';
import { Member } from '@shared/types/member';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  constructor() {}
  public get(): Observable<Member[]> {
    return of([
      {
        _id: '1',
        firstName: 'Alex',
        lastName: 'Zinkevich',
        colorScheme: 'primary'
      },
      {
        _id: '2',
        firstName: 'Orly',
        lastName: 'Knop',
        colorScheme: 'accent'
      },
      {
        _id: '5',
        firstName: 'anonymous',
        lastName: 'anonymous',
        colorScheme: 'accent'
      }
    ]);
  }

  public convertColorSchemeToClasses(colorScheme: string): string {
    return `color-${colorScheme}`;
  }

  public aggregate(members: Member[]): { [id: string]: Member } {
    const reducer = (accumulator, currentValue) => {
      return Object.assign(accumulator, currentValue);
    };
    return members.map(member => ({ [member._id]: member })).reduce(reducer);
  }
}
