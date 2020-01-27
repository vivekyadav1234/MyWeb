import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCatalogueComponent } from './view-catalogue.component';

describe('ViewCatalogueComponent', () => {
  let component: ViewCatalogueComponent;
  let fixture: ComponentFixture<ViewCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
