import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!!!';
  }

  // constructor(
  //   // jak są dwa ClientProxy, to nie działa ten drugi
  //   @Inject('NEST_TO_SPRING_SERVICE') private client2: ClientProxy,
  //   @Inject('USER_SERVICE') private client: ClientProxy,
  // ) {}

  // async sendHello(name: string): Promise<string> {
  //   return this.client.send({ cmd: 'hello' }, name).toPromise();
  // }

  // sendUserData(user: any) {
  //   return this.client.emit('user_created', user);
  // }

  // sendStringToSpring(message: string) {
  //   console.log('sending message to Spring:', message);
  //   return this.client2.emit('nest_to_spring', message);
  // }
}
