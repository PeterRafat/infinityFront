// custom-total-price.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomTotalPriceService {
  private totalPriceSource = new BehaviorSubject<number>(0);
  currentTotalPrice = this.totalPriceSource.asObservable();

  constructor() { }

  changeTotalPrice(price: number) {
    this.totalPriceSource.next(price);
  }
}
