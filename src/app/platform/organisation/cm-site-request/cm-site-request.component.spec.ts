import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmSiteRequestComponent } from './cm-site-request.component';

describe('CmSiteRequestComponent', () => {
  let component: CmSiteRequestComponent;
  let fixture: ComponentFixture<CmSiteRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmSiteRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmSiteRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
