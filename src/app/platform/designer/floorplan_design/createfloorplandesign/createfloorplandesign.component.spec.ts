import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatefloorplandesignComponent } from './createfloorplandesign.component';

describe('CreatefloorplandesignComponent', () => {
  let component: CreatefloorplandesignComponent;
  let fixture: ComponentFixture<CreatefloorplandesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatefloorplandesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatefloorplandesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
