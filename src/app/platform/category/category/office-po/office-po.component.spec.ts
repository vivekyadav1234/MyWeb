import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficePoComponent } from './office-po.component';

describe('OfficePoComponent', () => {
  let component: OfficePoComponent;
  let fixture: ComponentFixture<OfficePoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficePoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficePoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
