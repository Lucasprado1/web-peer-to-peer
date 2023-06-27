import { TestBed } from '@angular/core/testing';

import { App1Service } from './app1.service';

describe('App1Service', () => {
  let service: App1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(App1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
