import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentSubject } from '@shared/types';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataService } from '../data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentSubjectsService extends DataService {
  private readonly subjectsApi = 'payment-subjects';
  private subjectsList = new BehaviorSubject<{
    [familyId: string]: PaymentSubject[];
  }>({});
  constructor(
    http: HttpClient,
    globalVariablesService: GlobalVariablesService
  ) {
    super(http, globalVariablesService);
  }

  getSubjects(familyId: string): Observable<PaymentSubject[]> {
    return this.get(`${this.subjectsApi}/${familyId}`).pipe(
      switchMap((subjects: PaymentSubject[]) => {
        this.subjectsList.next({
          ...this.subjectsList.getValue(),
          [familyId]: subjects
        });
        return of(subjects);
      })
    );
  }

  getSubjectById(
    subjectId: string,
    familyId: string
  ): Observable<PaymentSubject> {
    if (!this.subjectsList.getValue()[familyId]) {
      return this.getSubjects(familyId).pipe(
        switchMap(() => of(this.findSubjectById(subjectId, familyId)))
      );
    }
    return of(this.findSubjectById(subjectId, familyId));
  }

  private findSubjectById(subjectId: string, familyId: string): PaymentSubject {
    const foundSubjects = this.subjectsList
      .getValue()
      [familyId].filter(subject => subject._id === subjectId);
    return foundSubjects.length ? foundSubjects[0] : null;
  }
}
