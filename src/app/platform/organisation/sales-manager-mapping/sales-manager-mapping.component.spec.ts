import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesManagerMappingComponent } from './sales-manager-mapping.component';

describe('SalesManagerMappingComponent', () => {
  let component: SalesManagerMappingComponent;
  let fixture: ComponentFixture<SalesManagerMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesManagerMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesManagerMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
