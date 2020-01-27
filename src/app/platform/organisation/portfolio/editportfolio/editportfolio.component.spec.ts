import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditportfolioComponent } from './editportfolio.component';

describe('EditportfolioComponent', () => {
  let component: EditportfolioComponent;
  let fixture: ComponentFixture<EditportfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditportfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditportfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
