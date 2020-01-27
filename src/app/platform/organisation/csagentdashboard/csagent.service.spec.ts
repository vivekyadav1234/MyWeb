import { TestBed, inject } from '@angular/core/testing';

import { CsagentService } from './csagent.service';

describe('CsagentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CsagentService]
    });
  });

  it('should ...', inject([CsagentService], (service: CsagentService) => {
    expect(service).toBeTruthy();
  }));
});
