import { TestBed, inject } from '@angular/core/testing';

import { MediaEngagementService } from './media-engagement.service';

describe('MediaEngagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaEngagementService]
    });
  });

  it('should be created', inject([MediaEngagementService], (service: MediaEngagementService) => {
    expect(service).toBeTruthy();
  }));
});
