import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FhiDataComponent } from './fhi-data.component';

describe('FhiDataComponent', () => {
  let component: FhiDataComponent;
  let fixture: ComponentFixture<FhiDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FhiDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FhiDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
