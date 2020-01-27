import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDesignerComponent } from './list-designer.component';

describe('ListDesignerComponent', () => {
  let component: ListDesignerComponent;
  let fixture: ComponentFixture<ListDesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
