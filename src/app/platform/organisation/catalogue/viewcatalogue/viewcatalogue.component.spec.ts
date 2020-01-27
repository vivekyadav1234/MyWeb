import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcatalogueComponent } from './viewcatalogue.component';

describe('ViewcatalogueComponent', () => {
  let component: ViewcatalogueComponent;
  let fixture: ComponentFixture<ViewcatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewcatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
