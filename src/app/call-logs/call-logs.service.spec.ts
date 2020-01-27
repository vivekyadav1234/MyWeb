import { TestBed, inject } from '@angular/core/testing';

import { CallLogsService } from './call-logs.service';

describe('CallLogsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CallLogsService]
    });
  });

  it('should be created', inject([CallLogsService], (service: CallLogsService) => {
    expect(service).toBeTruthy();
  }));
});
