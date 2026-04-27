import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptoModule } from '../crypto/crypto.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [CryptoModule, AuthenticationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
