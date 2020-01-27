import { TestBed, inject } from '@angular/core/testing';

import { FloorplannerService } from './floorplanner.service';

describe('FloorplannerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FloorplannerService]
    });
  });

  it('should ...', inject([FloorplannerService], (service: FloorplannerService) => {
    expect(service).toBeTruthy();
  }));
});
