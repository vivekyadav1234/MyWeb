import { TestBed, inject } from '@angular/core/testing';

import { SitesupervisorService } from './sitesupervisor.service';

describe('SitesupervisorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SitesupervisorService]
    });
  });

  it('should be created', inject([SitesupervisorService], (service: SitesupervisorService) => {
    expect(service).toBeTruthy();
  }));
});
