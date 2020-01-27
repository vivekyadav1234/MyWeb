import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProjectrequestComponent } from './list-projectrequest.component';

describe('ListProjectrequestComponent', () => {
  let component: ListProjectrequestComponent;
  let fixture: ComponentFixture<ListProjectrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProjectrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProjectrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
