import { TestBed, inject } from '@angular/core/testing';

import { FloorplanDesignService } from './floorplan-design.service';

describe('FloorplanDesignService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FloorplanDesignService]
    });
  });

  it('should ...', inject([FloorplanDesignService], (service: FloorplanDesignService) => {
    expect(service).toBeTruthy();
  }));
});
