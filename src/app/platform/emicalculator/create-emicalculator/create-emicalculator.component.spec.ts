import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmicalculatorComponent } from './create-emicalculator.component';

describe('CreateEmicalculatorComponent', () => {
  let component: CreateEmicalculatorComponent;
  let fixture: ComponentFixture<CreateEmicalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEmicalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmicalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
