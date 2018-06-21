import * as amqp from 'amqplib';
import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export class RabbitMQReceiver extends Server implements CustomTransportStrategy {
  private server: amqp.Connection = null;
  private channel: amqp.Channel = null;

  constructor(private readonly host: string, private readonly queue: string) {
    super();
  }

  public async listen(callback: () => void) {
    await this.init();
    this.channel.consume(`${this.queue}_sub`, this.handleMessage.bind(this), {
      noAck: true,
    });
  }

  public close() {
    this.channel && this.channel.close();
    this.server && this.server.close();
  }

  private async handleMessage(message) {
    const { cmd, payload } = JSON.parse(message.content.toString());

    if (!this.messageHandlers[`"${cmd}"`]) {
      return;
    }

    const handler = this.messageHandlers[`"${cmd}"`];
    const response$ = this.transformToObservable(
      await handler(payload),
    ) as Observable<any>;

    return response$.toPromise();
  }

  private async init() {
    this.server = await amqp.connect(this.host);
    this.channel = await this.server.createChannel();
    this.channel.assertQueue(`${this.queue}_sub`, { durable: false });
  }
}
