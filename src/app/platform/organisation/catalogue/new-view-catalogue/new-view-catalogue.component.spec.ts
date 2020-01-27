import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewViewCatalogueComponent } from './new-view-catalogue.component';

describe('NewViewCatalogueComponent', () => {
  let component: NewViewCatalogueComponent;
  let fixture: ComponentFixture<NewViewCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewViewCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewViewCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
