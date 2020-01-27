import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MkwLayoutsComponent } from './mkw-layouts.component';

describe('MkwLayoutsComponent', () => {
  let component: MkwLayoutsComponent;
  let fixture: ComponentFixture<MkwLayoutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MkwLayoutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MkwLayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
