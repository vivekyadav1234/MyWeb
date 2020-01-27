import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryProposalsComponent } from './category-proposals.component';

describe('CategoryProposalsComponent', () => {
  let component: CategoryProposalsComponent;
  let fixture: ComponentFixture<CategoryProposalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryProposalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
