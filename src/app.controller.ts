import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // odbiorca wiadomości
  // @MessagePattern({ cmd: 'hello' })
  // handleHello(data: string): string {
  //   console.log('Received message:', data);
  //   return `Hello, ${data}!`;
  // }

  // @Get('hello')
  // async getHello(@Query('name') name: string): Promise<string> {
  //   return this.appService.sendHello(name);
  // }

  // @EventPattern('user_created') //<- routing key
  // handleUserCreated(data: any) {
  //   console.log('User received in consumer:', data);
  // }

  // @EventPattern('nest_from_spring') //<- routing key
  // handleNestFromSpring(data: string) {
  //   console.log('Message received from Spring:', data);
  // }

  // @Post('send')
  // send(@Body() user: any) {
  //   return this.appService.sendUserData(user);
  // }

  // @Get('nest-to-spring')
  // nestToSpring(@Query('message') message: string) {
  //   return this.appService.sendStringToSpring(message);
  // }
}
