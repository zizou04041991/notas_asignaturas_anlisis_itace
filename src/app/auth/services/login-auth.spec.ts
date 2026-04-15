import { TestBed } from '@angular/core/testing';

import { LoginAuth } from './login-auth';

describe('LoginAuth', () => {
  let service: LoginAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
