import { TestBed, inject } from '@angular/core/testing';

import { ModularproductsService } from './modularproducts.service';

describe('ModularproductsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModularproductsService]
    });
  });

  it('should ...', inject([ModularproductsService], (service: ModularproductsService) => {
    expect(service).toBeTruthy();
  }));
});
