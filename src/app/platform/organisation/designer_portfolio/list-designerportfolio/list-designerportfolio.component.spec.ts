import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDesignerportfolioComponent } from './list-designerportfolio.component';

describe('ListDesignerportfolioComponent', () => {
  let component: ListDesignerportfolioComponent;
  let fixture: ComponentFixture<ListDesignerportfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDesignerportfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDesignerportfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
