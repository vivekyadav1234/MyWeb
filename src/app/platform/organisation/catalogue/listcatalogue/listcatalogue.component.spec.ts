import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListcatalogueComponent } from './listcatalogue.component';

describe('ListcatalogueComponent', () => {
  let component: ListcatalogueComponent;
  let fixture: ComponentFixture<ListcatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListcatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListcatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
