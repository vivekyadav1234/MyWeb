import { TestBed, inject } from '@angular/core/testing';

import { OrderManagerService } from './order-manager.service';

describe('OrderManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderManagerService]
    });
  });

  it('should be created', inject([OrderManagerService], (service: OrderManagerService) => {
    expect(service).toBeTruthy();
  }));
});
