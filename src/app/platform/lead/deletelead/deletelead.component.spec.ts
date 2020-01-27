import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteleadComponent } from './deletelead.component';

describe('DeleteleadComponent', () => {
  let component: DeleteleadComponent;
  let fixture: ComponentFixture<DeleteleadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteleadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
