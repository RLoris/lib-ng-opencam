import { TestBed } from '@angular/core/testing';

import { OpencamService } from './opencam.service';

describe('OpencamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpencamService = TestBed.get(OpencamService);
    expect(service).toBeTruthy();
  });
});
