import { Module } from '@nestjs/common';
import { OdbiorcaController } from './odbiorca.controller';
import { OdbiorcaService } from './odbiorca.service';

@Module({
  controllers: [OdbiorcaController],
  providers: [OdbiorcaService],
})
export class OdbiorcaModule {}
