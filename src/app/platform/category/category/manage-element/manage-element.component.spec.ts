import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageElementComponent } from './manage-element.component';

describe('ManageElementComponent', () => {
  let component: ManageElementComponent;
  let fixture: ComponentFixture<ManageElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
