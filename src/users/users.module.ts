import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { User as User_, UserSchema } from './user.schema';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([{ name: User_.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
