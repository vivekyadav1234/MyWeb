import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialBoqsComponent } from './initial-boqs.component';

describe('InitialBoqsComponent', () => {
  let component: InitialBoqsComponent;
  let fixture: ComponentFixture<InitialBoqsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialBoqsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialBoqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
