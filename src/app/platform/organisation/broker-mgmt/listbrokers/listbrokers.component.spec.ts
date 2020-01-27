import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListbrokersComponent } from './listbrokers.component';

describe('ListbrokersComponent', () => {
  let component: ListbrokersComponent;
  let fixture: ComponentFixture<ListbrokersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListbrokersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListbrokersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
