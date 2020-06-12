import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IsDevModeService {

  constructor() { }

  isDevMode(): boolean {
    return isDevMode();
  }
}
