import { Get, Controller, HttpService, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { map, switchMap } from 'rxjs/operators';
import { MailerService } from 'mailer/mailer.service';

@Controller()
export class AppController {
  constructor(
    private httpService: HttpService,
    private mailerService: MailerService,
  ) {}

  @MessagePattern('delivery')
  deliverNotification(payload) {
    const userId = payload.user.id;
    const tracking = payload.tracking;

    const sendMail$ = this.httpService
      .get(`http://localhost:3000/users/${userId}`)
      .pipe(
        map(user => {
          return createMailOptions(user.data, tracking);
        }),
        switchMap(options => {
          return this.mailerService.sendMail(options);
        }),
      )
      .subscribe(
        success => {
          Logger.log(`Mail sended to userId ${userId} `);
          sendMail$.unsubscribe();
        },
        error => {
          Logger.error(`Error to send mail to ${userId} `, error.toString());
          sendMail$.unsubscribe();
        },
      );
  }

  @MessagePattern('newCommand')
  newCommandNotification() {
    console.log('newCommand');
  }
}

function createMailOptions(user, tracking) {
  return {
    from: '"Package Deliverer 📦" <package@deliverer.com>',
    to: user.email,
    subject: `Your package ${tracking.name} is now in ${tracking.location}`,
    text: `Hi ${user.firstname} \n Your package ${tracking.name} is now in ${
      tracking.location
    }`,
    html: `Hi ${user.firstname} <br> Your package ${tracking.name} is now in ${
      tracking.location
    }`,
  };
}
