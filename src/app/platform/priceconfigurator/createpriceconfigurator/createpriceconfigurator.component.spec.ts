import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepriceconfiguratorComponent } from './createpriceconfigurator.component';

describe('CreatepriceconfiguratorComponent', () => {
  let component: CreatepriceconfiguratorComponent;
  let fixture: ComponentFixture<CreatepriceconfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatepriceconfiguratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatepriceconfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
