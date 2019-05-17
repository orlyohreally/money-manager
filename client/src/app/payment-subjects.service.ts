import { Injectable } from '@angular/core';
import { PaymentSubject } from '@shared/types/payment-subject';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentSubjectsService {
  constructor() {}

  public get(): Observable<PaymentSubject[]> {
    return of([
      {
        _id: '1',
        familyId: '1',
        name: 'food',
        icon: 'assets/payment-subjects-icons/grocery.png'
      },
      {
        _id: '2',
        familyId: '1',
        name: 'apartment',
        icon: 'assets/payment-subjects-icons/apartment.png'
      }
    ]);
  }

  public aggregate(
    subjects: PaymentSubject[]
  ): { [id: string]: PaymentSubject } {
    const reducer = (accumulator, currentValue) => {
      return Object.assign(accumulator, currentValue);
    };
    return subjects
      .map(subject => ({ [subject._id]: subject }))
      .reduce(reducer);
  }
}
