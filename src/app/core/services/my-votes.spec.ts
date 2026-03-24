import { TestBed } from '@angular/core/testing';

import { MyVotes } from './my-votes';

describe('MyVotes', () => {
  let service: MyVotes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyVotes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
