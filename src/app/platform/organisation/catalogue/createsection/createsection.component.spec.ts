import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatesectionComponent } from './createsection.component';

describe('CreatesectionComponent', () => {
  let component: CreatesectionComponent;
  let fixture: ComponentFixture<CreatesectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatesectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatesectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
