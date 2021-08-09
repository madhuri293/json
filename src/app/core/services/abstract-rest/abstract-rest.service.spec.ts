import { TestBed } from '@angular/core/testing';

import { AbstractRestService } from './abstract-rest.service';

describe('AbstractRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbstractRestService = TestBed.get(AbstractRestService);
    expect(service).toBeTruthy();
  });
});
