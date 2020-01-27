import { TestBed, inject } from '@angular/core/testing';

import { UserMappingService } from './user-mapping.service';

describe('UserMappingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserMappingService]
    });
  });

  it('should be created', inject([UserMappingService], (service: UserMappingService) => {
    expect(service).toBeTruthy();
  }));
});
