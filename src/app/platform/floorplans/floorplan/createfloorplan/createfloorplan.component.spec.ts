import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatefloorplanComponent } from './createfloorplan.component';

describe('CreatefloorplanComponent', () => {
  let component: CreatefloorplanComponent;
  let fixture: ComponentFixture<CreatefloorplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatefloorplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatefloorplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
