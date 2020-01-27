import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepresentationComponent } from './createpresentation.component';

describe('CreatepresentationComponent', () => {
  let component: CreatepresentationComponent;
  let fixture: ComponentFixture<CreatepresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatepresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatepresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
