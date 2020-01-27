import { TestBed, inject } from '@angular/core/testing';

import { GanttService } from './gantt.service';

describe('GanttService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GanttService]
    });
  });

  it('should ...', inject([GanttService], (service: GanttService) => {
    expect(service).toBeTruthy();
  }));
});
