import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsectionComponent } from './viewsection.component';

describe('ViewsectionComponent', () => {
  let component: ViewsectionComponent;
  let fixture: ComponentFixture<ViewsectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewsectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
