import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDesignerportfolioComponent } from './view-designerportfolio.component';

describe('ViewDesignerportfolioComponent', () => {
  let component: ViewDesignerportfolioComponent;
  let fixture: ComponentFixture<ViewDesignerportfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDesignerportfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDesignerportfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
