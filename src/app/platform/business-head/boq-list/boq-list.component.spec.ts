import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqListComponent } from './boq-list.component';

describe('BoqListComponent', () => {
  let component: BoqListComponent;
  let fixture: ComponentFixture<BoqListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoqListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
