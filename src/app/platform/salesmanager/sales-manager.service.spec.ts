import { TestBed, inject } from '@angular/core/testing';

import { SalesManagerService } from './sales-manager.service';

describe('SalesManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesManagerService]
    });
  });

  it('should be created', inject([SalesManagerService], (service: SalesManagerService) => {
    expect(service).toBeTruthy();
  }));
});
