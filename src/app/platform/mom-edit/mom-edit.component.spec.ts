import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MomEditComponent } from './mom-edit.component';

describe('MomEditComponent', () => {
  let component: MomEditComponent;
  let fixture: ComponentFixture<MomEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MomEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MomEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
