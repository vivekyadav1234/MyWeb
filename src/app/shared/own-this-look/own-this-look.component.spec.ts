import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnThisLookComponent } from './own-this-look.component';

describe('OwnThisLookComponent', () => {
  let component: OwnThisLookComponent;
  let fixture: ComponentFixture<OwnThisLookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnThisLookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnThisLookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
