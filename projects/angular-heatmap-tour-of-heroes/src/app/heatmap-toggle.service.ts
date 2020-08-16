import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeatmapToggleService {

  private toggled = new BehaviorSubject<boolean>(true);

  get toggled$() {
    return this.toggled.asObservable();
  }

  constructor() { }

  enable() {
    this.toggled.next(true);
  }

  disable() {
    this.toggled.next(false);
  }

  toggle() {
    this.toggled.next(!this.toggled.value);
  }
}
