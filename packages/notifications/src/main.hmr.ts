import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMQReceiver } from '_rabbit-mq/rabbitmq.receiver';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new RabbitMQReceiver('amqp://localhost', 'channel'),
  });
  await app.listen(() => ``);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
