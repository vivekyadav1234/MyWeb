import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerMgmtComponent } from './designer-mgmt.component';

describe('DesignerMgmtComponent', () => {
  let component: DesignerMgmtComponent;
  let fixture: ComponentFixture<DesignerMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
