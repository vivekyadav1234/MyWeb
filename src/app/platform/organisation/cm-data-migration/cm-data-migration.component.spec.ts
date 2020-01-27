import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmDataMigrationComponent } from './cm-data-migration.component';

describe('CmDataMigrationComponent', () => {
  let component: CmDataMigrationComponent;
  let fixture: ComponentFixture<CmDataMigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmDataMigrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmDataMigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
