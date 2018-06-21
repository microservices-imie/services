import { Module, HttpService } from '@nestjs/common';
import { AppController } from './app.controller';
import { MailerService } from 'mailer/mailer.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [MailerService, HttpService],
})
export class AppModule {}
