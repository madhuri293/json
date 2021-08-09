import { TestBed } from '@angular/core/testing';

import { LimsAnalysisMethodService } from './lims-analysis-method.service';

describe('LimsAnalysisMethodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LimsAnalysisMethodService = TestBed.get(LimsAnalysisMethodService);
    expect(service).toBeTruthy();
  });
});
