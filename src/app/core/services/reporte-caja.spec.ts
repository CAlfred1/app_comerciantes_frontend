import { TestBed } from '@angular/core/testing';

import { ReporteCaja } from './reporte-caja';

describe('ReporteCaja', () => {
  let service: ReporteCaja;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteCaja);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
