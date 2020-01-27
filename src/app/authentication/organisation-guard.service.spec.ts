import { TestBed, inject } from '@angular/core/testing';

import { OrganisationGuardService } from './organisation-guard.service';

describe('OrganisationGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganisationGuardService]
    });
  });

  it('should ...', inject([OrganisationGuardService], (service: OrganisationGuardService) => {
    expect(service).toBeTruthy();
  }));
});
