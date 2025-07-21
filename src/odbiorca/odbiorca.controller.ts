import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('odbiorca')
export class OdbiorcaController {
  //* Direct
  // * odbiór i odpowiedź
  @MessagePattern({ cmd: 'hello' })
  handleHello(data: string): string {
    console.log('Received message:', data);
    return `Hello, ${data}!`;
  }

  // * odbiór bez odpowiedzi
  @EventPattern('test_queue')
  handleUserCreated(data: any) {
    console.log('🔥 Nowy użytkownik utworzony:', data);
  }

  // ######
  // * Topic
  //   @EventPattern('user.*')
  //   handleWildcardEvent1(data: any) {
  //     console.log('📥 [user.*] Received:', data);
  //   }
}
