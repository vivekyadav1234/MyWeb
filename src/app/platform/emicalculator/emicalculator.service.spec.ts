import { TestBed, inject } from '@angular/core/testing';

import { EmicalculatorService } from './emicalculator.service';

describe('EmicalculatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmicalculatorService]
    });
  });

  it('should ...', inject([EmicalculatorService], (service: EmicalculatorService) => {
    expect(service).toBeTruthy();
  }));
});
