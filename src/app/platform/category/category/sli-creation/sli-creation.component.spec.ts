import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliCreationComponent } from './sli-creation.component';

describe('SliCreationComponent', () => {
  let component: SliCreationComponent;
  let fixture: ComponentFixture<SliCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
