import { TestBed } from '@angular/core/testing';

import { DashboardPPIC } from './pic.service';

describe('DashboardPPIC', () => {
  let service: DashboardPPIC;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardPPIC);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
