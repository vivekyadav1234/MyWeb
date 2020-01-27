import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBoqsComponent } from './list-boqs.component';

describe('ListBoqsComponent', () => {
  let component: ListBoqsComponent;
  let fixture: ComponentFixture<ListBoqsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBoqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBoqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
