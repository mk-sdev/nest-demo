import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('user_created')
  handleUserCreated(data: any) {
    console.log('User received in consumer:', data);
  }

  @Post('send')
  send(@Body() user: any) {
    return this.appService.sendUserData(user);
  }
}
