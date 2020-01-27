import { TestBed, inject } from '@angular/core/testing';

import { DesignerGuardService } from './designer-guard.service';

describe('DesignerGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DesignerGuardService]
    });
  });

  it('should ...', inject([DesignerGuardService], (service: DesignerGuardService) => {
    expect(service).toBeTruthy();
  }));
});
