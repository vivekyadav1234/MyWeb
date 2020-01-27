import { TestBed, inject } from '@angular/core/testing';

import { DesignerService } from './designer.service';

describe('DesignerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DesignerService]
    });
  });

  it('should ...', inject([DesignerService], (service: DesignerService) => {
    expect(service).toBeTruthy();
  }));
});
