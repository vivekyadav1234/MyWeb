import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesCadComponent } from './files-cad.component';

describe('FilesCadComponent', () => {
  let component: FilesCadComponent;
  let fixture: ComponentFixture<FilesCadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesCadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesCadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
