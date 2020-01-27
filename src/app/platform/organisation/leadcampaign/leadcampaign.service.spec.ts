import { TestBed, inject } from '@angular/core/testing';

import { LeadcampaignService } from './leadcampaign.service';

describe('LeadcampaignService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeadcampaignService]
    });
  });

  it('should be created', inject([LeadcampaignService], (service: LeadcampaignService) => {
    expect(service).toBeTruthy();
  }));
});
