import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimsAnalysisMethodComponent } from './lims-analysis-method.component';

describe('LimsAnalysisMethodComponent', () => {
  let component: LimsAnalysisMethodComponent;
  let fixture: ComponentFixture<LimsAnalysisMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimsAnalysisMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimsAnalysisMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
