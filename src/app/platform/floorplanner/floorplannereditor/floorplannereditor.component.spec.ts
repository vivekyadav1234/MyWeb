import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorplannereditorComponent } from './floorplannereditor.component';

describe('FloorplannereditorComponent', () => {
  let component: FloorplannereditorComponent;
  let fixture: ComponentFixture<FloorplannereditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorplannereditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorplannereditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
