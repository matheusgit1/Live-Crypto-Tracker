import { Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

    // | `POST` | `/api/auth/register` | Registrar usuário | ❌ |
  // | `POST` | `/api/auth/login` | Login (retorna JWT) | ❌ |

  @Post('register')
  async register() {
    return this.authenticationService.register();
  }

  @Post('login')
  async login() {
    return this.authenticationService.login();
  }
}
