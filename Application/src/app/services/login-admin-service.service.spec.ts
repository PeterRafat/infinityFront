import { TestBed } from '@angular/core/testing';

import { LoginAdminServiceService } from './login-admin-service.service';

describe('LoginAdminServiceService', () => {
  let service: LoginAdminServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginAdminServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
