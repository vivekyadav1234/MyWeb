import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MomCreateFormComponent } from './mom-create-form.component';

describe('MomCreateFormComponent', () => {
  let component: MomCreateFormComponent;
  let fixture: ComponentFixture<MomCreateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MomCreateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MomCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
