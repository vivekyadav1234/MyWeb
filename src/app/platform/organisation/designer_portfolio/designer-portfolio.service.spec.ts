import { TestBed, inject } from '@angular/core/testing';

import { DesignerPortfolioService } from './designer-portfolio.service';

describe('DesignerPortfolioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DesignerPortfolioService]
    });
  });

  it('should ...', inject([DesignerPortfolioService], (service: DesignerPortfolioService) => {
    expect(service).toBeTruthy();
  }));
});
