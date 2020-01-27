import { TestBed, inject } from '@angular/core/testing';

import { CommunitymanagerService } from './communitymanager.service';

describe('CommunitymanagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommunitymanagerService]
    });
  });

  it('should ...', inject([CommunitymanagerService], (service: CommunitymanagerService) => {
    expect(service).toBeTruthy();
  }));
});
