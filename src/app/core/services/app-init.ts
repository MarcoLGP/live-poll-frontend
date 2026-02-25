import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  private _isInitialized = signal(false);
  readonly isInitialized = this._isInitialized.asReadonly();

  setInitialized() {
    this._isInitialized.set(true);
  }
}
