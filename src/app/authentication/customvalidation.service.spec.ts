import { TestBed, inject } from '@angular/core/testing';

import { CustomvalidationService } from './customvalidation.service';

describe('CustomvalidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomvalidationService]
    });
  });

  it('should ...', inject([CustomvalidationService], (service: CustomvalidationService) => {
    expect(service).toBeTruthy();
  }));
});
