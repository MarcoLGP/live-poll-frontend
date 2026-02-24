import { TestBed } from '@angular/core/testing';

import { Confetti } from './confetti';

describe('Confetti', () => {
  let service: Confetti;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Confetti);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
