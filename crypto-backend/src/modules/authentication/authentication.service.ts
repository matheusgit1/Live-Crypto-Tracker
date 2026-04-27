import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  register() {
    return 'This action registers a new user';
  }

  login() {
    return 'This action logs in a user and returns a JWT';
  }
}
