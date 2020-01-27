import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerTasksComponent } from './designer-tasks.component';

describe('DesignerTasksComponent', () => {
  let component: DesignerTasksComponent;
  let fixture: ComponentFixture<DesignerTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
