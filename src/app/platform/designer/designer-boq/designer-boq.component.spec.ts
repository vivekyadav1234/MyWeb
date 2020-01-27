import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerBoqComponent } from './designer-boq.component';

describe('DesignerBoqComponent', () => {
  let component: DesignerBoqComponent;
  let fixture: ComponentFixture<DesignerBoqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerBoqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerBoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
