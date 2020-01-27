import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MkwDataComponent } from './mkw-data.component';

describe('MkwDataComponent', () => {
  let component: MkwDataComponent;
  let fixture: ComponentFixture<MkwDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MkwDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MkwDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
