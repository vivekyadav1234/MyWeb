import { TestBed, inject } from '@angular/core/testing';

import { PortfolioService } from './portfolio.service';

describe('PortfolioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioService]
    });
  });

  it('should ...', inject([PortfolioService], (service: PortfolioService) => {
    expect(service).toBeTruthy();
  }));
});
