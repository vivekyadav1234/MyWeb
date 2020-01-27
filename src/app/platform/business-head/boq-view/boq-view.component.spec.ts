import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqViewComponent } from './boq-view.component';

describe('BoqViewComponent', () => {
  let component: BoqViewComponent;
  let fixture: ComponentFixture<BoqViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoqViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoqViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
