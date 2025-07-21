import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NadawcaService {
  constructor(
    @Inject('TEST_SERVICE')
    private readonly directClient: ClientProxy,
    // @Inject('TOPIC_SERVICE')
    // private readonly topicClient: ClientProxy,
  ) {}

  // * oczekiwanie na odpowiedź (RPC)
  async sendDirectHello(name: string): Promise<string> {
    return this.directClient.send({ cmd: 'hello' }, name).toPromise();
  } // tu brak jawnego bind key

  // * brak odpowiedzi (Event)
  emitDirectHello(userData: any): void {
    this.directClient.emit(
      'test_queue', //<- binding key, taki sam jak nazwa kolejki, bo exchanger to ''
      userData,
    );
  }

  // //////
  //   emitUserCreatedEvent(user: any) {
  //     // 👇 ręcznie podajemy routing key do topic exchange
  //     this.topicClient.emit('user.created', user);
  //   }
}
