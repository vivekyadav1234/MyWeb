import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewViewCatalogueDetailsComponent } from './new-view-catalogue-details.component';

describe('NewViewCatalogueDetailsComponent', () => {
  let component: NewViewCatalogueDetailsComponent;
  let fixture: ComponentFixture<NewViewCatalogueDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewViewCatalogueDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewViewCatalogueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
