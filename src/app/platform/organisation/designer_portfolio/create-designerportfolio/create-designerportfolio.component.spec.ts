import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDesignerportfolioComponent } from './create-designerportfolio.component';

describe('CreateDesignerportfolioComponent', () => {
  let component: CreateDesignerportfolioComponent;
  let fixture: ComponentFixture<CreateDesignerportfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDesignerportfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDesignerportfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
