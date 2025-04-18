import { TestBed } from '@angular/core/testing';

import { CustomeTotalPriceService } from './custome-total-price.service';

describe('CustomeTotalPriceService', () => {
  let service: CustomeTotalPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomeTotalPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
