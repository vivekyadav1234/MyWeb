import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReleaseComponent } from './po-release.component';

describe('PoReleaseComponent', () => {
  let component: PoReleaseComponent;
  let fixture: ComponentFixture<PoReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
