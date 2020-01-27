import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListportfoliodataComponent } from './listportfoliodata.component';

describe('ListportfoliodataComponent', () => {
  let component: ListportfoliodataComponent;
  let fixture: ComponentFixture<ListportfoliodataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListportfoliodataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListportfoliodataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
