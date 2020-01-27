import { TestBed, inject } from '@angular/core/testing';

import { GeneralManagerService } from './general-manager.service';

describe('GeneralManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralManagerService]
    });
  });

  it('should be created', inject([GeneralManagerService], (service: GeneralManagerService) => {
    expect(service).toBeTruthy();
  }));
});
