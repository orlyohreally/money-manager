import { Injectable } from "@angular/core";
import { PaymentSubject } from "@shared/types";
import { Observable, of } from "rxjs";
import { normalizedArray, normalize } from "@shared/utils";

@Injectable({
  providedIn: "root"
})
export class PaymentSubjectsService {
  public paymentSubjects: normalizedArray<PaymentSubject>;
  constructor() {
    this.paymentSubjects = normalize([
      {
        _id: "1",
        familyId: "1",
        name: "food",
        icon: "assets/payment-subjects-icons/grocery.png"
      },
      {
        _id: "2",
        familyId: "1",
        name: "apartment",
        icon: "assets/payment-subjects-icons/apartment.png"
      }
    ]);
  }

  public getSubjects(): Observable<normalizedArray<PaymentSubject>> {
    return of(this.paymentSubjects);
  }

  public async createSubject(subject: PaymentSubject) {
    return new Promise<string>((resolve, reject) => {
      subject._id = "10"; //String(Number(Object.keys(this.paymentSubjects)) + 1);
      this.paymentSubjects[subject._id] = subject;
      resolve("success");
    });
  }

  public async updateSubject(subject: PaymentSubject) {
    return new Promise<string>((resolve, reject) => {
      this.paymentSubjects[subject._id] = subject;
      resolve("success");
    });
  }
}
