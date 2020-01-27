import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateleadComponent } from './updatelead.component';

describe('UpdateleadComponent', () => {
  let component: UpdateleadComponent;
  let fixture: ComponentFixture<UpdateleadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateleadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
