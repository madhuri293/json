import { TestBed } from '@angular/core/testing';

import { CatalystMainMastersService } from './catalyst-main-masters.service';

describe('CatalystMainMastersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CatalystMainMastersService = TestBed.get(CatalystMainMastersService);
    expect(service).toBeTruthy();
  });
});
