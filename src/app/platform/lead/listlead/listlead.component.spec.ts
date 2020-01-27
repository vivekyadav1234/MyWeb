import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListleadComponent } from './listlead.component';

describe('ListleadComponent', () => {
  let component: ListleadComponent;
  let fixture: ComponentFixture<ListleadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListleadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
