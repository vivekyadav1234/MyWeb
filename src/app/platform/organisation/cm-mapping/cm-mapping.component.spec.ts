import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmMappingComponent } from './cm-mapping.component';

describe('CmMappingComponent', () => {
  let component: CmMappingComponent;
  let fixture: ComponentFixture<CmMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
