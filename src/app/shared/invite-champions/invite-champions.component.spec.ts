import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteChampionsComponent } from './invite-champions.component';

describe('InviteChampionsComponent', () => {
  let component: InviteChampionsComponent;
  let fixture: ComponentFixture<InviteChampionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteChampionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteChampionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
