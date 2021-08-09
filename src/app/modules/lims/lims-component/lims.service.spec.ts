import { TestBed } from '@angular/core/testing';

import { LimsService } from './lims.service';

describe('LimsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LimsService = TestBed.get(LimsService);
    expect(service).toBeTruthy();
  });
});
