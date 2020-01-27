import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingListBomComponent } from './cutting-list-bom.component';

describe('CuttingListBomComponent', () => {
  let component: CuttingListBomComponent;
  let fixture: ComponentFixture<CuttingListBomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuttingListBomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingListBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
