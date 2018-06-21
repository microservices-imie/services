import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { from } from 'rxjs';

@Injectable()
export class MailerService {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'usermicroimie@gmail.com',
      pass: 'usermicro',
    },
  });

  constructor() {}

  async sendMail(mailOptions) {
    return from(this.transporter.sendMail(mailOptions));
  }
}
