import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMQReceiver } from '_rabbit-mq/rabbitmq.receiver';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new RabbitMQReceiver('amqp://rabbitmq', 'channel'),
  });

  app.listen(() => ``);
}
bootstrap();
