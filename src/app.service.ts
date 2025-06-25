import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!!';
  }

  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  sendUserData(user: any) {
    return this.client.emit('user_created', user);
  }
}
