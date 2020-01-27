import { TestBed, inject } from '@angular/core/testing';

import { ReferralService } from './referral.service';

describe('ReferralService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReferralService]
    });
  });

  it('should be created', inject([ReferralService], (service: ReferralService) => {
    expect(service).toBeTruthy();
  }));
});
