import { Controller, Get, Query } from '@nestjs/common';
import { NadawcaService } from './nadawca.service';

@Controller('nadawca')
export class NadawcaController {
  constructor(private readonly nadawcaService: NadawcaService) {}

  // * Direct
  @Get('hello')
  async getHello(@Query('name') name: string): Promise<string> {
    return this.nadawcaService.sendDirectHello(name);
  }

  @Get('hello2')
  emitHello(@Query('name') name: string) {
    this.nadawcaService.emitDirectHello({ name });
    return { status: 'Message sent (fire-and-forget)' };
  }

  // * Topic
  //   @Get('hello3')
  //   emitHello2(@Query('name') name: string) {
  //     this.nadawcaService.emitUserCreatedEvent({ name });
  //     return { status: 'Message sent (fire-and-forget) [TOPIC]' };
  //   }
}
