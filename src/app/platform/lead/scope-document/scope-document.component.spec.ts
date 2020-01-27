import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeDocumentComponent } from './scope-document.component';

describe('ScopeDocumentComponent', () => {
  let component: ScopeDocumentComponent;
  let fixture: ComponentFixture<ScopeDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScopeDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScopeDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
