import { Module } from '@nestjs/common';
import { NadawcaController } from './nadawca.controller';
import { NadawcaService } from './nadawca.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TEST_SERVICE', //<- nazwa emitera
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'test_queue', // <- nazwa kolejki
          queueOptions: { durable: false },
        }, // brak jawnego exchange, więc typ to direct
      },
      // ! jeśli typ inny niż direct to trzeba ręcznie utworzyc w rabbitmq taki exchanger itp.
      // {
      //   name: 'TOPIC_SERVICE',
      //   transport: Transport.RMQ,
      //   options: {
      //     urls: ['amqp://localhost:5672'],
      //     queue: 'topic_queue', // dowolna kolejka
      //     queueOptions: { durable: false },
      //     exchange: 'my_topic_exchange',
      //     exchangeType: 'topic',
      //     routingKey: 'user.created', // <== użyty domyślnie przez emit/send
      //   },
      // },
    ]),
  ],
  controllers: [NadawcaController],
  providers: [NadawcaService],
})
export class NadawcaModule {}
