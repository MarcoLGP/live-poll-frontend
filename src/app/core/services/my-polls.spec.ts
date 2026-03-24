import { TestBed } from '@angular/core/testing';

import { MyPolls } from './my-polls';

describe('MyPolls', () => {
  let service: MyPolls;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyPolls);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
