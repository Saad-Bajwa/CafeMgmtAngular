import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiComponentService {
  private _showNavbar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {}

  // Observable to expose the navbar visibility state
  get showNavbar() {
    return this._showNavbar.asObservable();
  }
  navbarVisibility$ = this._showNavbar.asObservable();
  // Method to hide the navbar
  hide(): void {
    this._showNavbar.next(false);
  }

  // Method to show the navbar
  display(): void {
    this._showNavbar.next(true);
  }
}
