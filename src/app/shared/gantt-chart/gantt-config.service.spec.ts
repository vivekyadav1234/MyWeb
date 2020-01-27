import { TestBed, inject } from '@angular/core/testing';

import { GanttConfigService } from './gantt-config.service';

describe('GanttConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GanttConfigService]
    });
  });

  it('should ...', inject([GanttConfigService], (service: GanttConfigService) => {
    expect(service).toBeTruthy();
  }));
});
