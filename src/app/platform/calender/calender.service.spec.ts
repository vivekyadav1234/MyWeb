import { TestBed, inject } from '@angular/core/testing';

import { CalenderService } from './calender.service';

describe('CalenderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalenderService]
    });
  });

  it('should be created', inject([CalenderService], (service: CalenderService) => {
    expect(service).toBeTruthy();
  }));
});
