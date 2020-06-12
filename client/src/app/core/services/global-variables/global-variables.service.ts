import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
  constructor() {}

  get apiURL(): string {
    return environment.backendURL;
  }

  get supportEmail(): string {
    return environment.supportEmail;
  }

  get gaMeasurementId(): string {
    return environment.gaMeasurementId;
  }
}
