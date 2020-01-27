import { TestBed, inject } from '@angular/core/testing';

import { PriceconfiguratorService } from './priceconfigurator.service';

describe('PriceconfiguratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriceconfiguratorService]
    });
  });

  it('should ...', inject([PriceconfiguratorService], (service: PriceconfiguratorService) => {
    expect(service).toBeTruthy();
  }));
});
