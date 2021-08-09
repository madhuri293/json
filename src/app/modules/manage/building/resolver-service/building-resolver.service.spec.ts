import { TestBed } from '@angular/core/testing';

import { BuildingResolverService } from './building-resolver.service';

describe('BuildingResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuildingResolverService = TestBed.get(BuildingResolverService);
    expect(service).toBeTruthy();
  });
});
