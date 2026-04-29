import { TestBed } from '@angular/core/testing';

import { MotivoCobro } from './motivo-cobro';

describe('MotivoCobro', () => {
  let service: MotivoCobro;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotivoCobro);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
