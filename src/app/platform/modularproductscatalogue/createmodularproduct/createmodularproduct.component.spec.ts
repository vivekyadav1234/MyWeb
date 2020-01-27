import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemodularproductComponent } from './createmodularproduct.component';

describe('CreatemodularproductComponent', () => {
  let component: CreatemodularproductComponent;
  let fixture: ComponentFixture<CreatemodularproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatemodularproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatemodularproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
