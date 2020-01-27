import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentCatalogueComponent } from './segment-catalogue.component';

describe('SegmentCatalogueComponent', () => {
  let component: SegmentCatalogueComponent;
  let fixture: ComponentFixture<SegmentCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
