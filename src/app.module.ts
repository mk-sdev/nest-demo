import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
// import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { PrismaModule } from 'prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailerModule } from '@nestjs-modules/mailer';
// import { join } from 'path';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TasksModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'scrabble',
      autoLoadEntities: true,
      synchronize: true, // tylko w dev — w produkcji = false
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/nestdb'),
    ConfigModule.forRoot({
      isGlobal: true, // ← umożliwia korzystanie z .env w całej aplikacji
    }),
    // PrismaModule,

    // serwis emitujący
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'user_queue',
          queueOptions: { durable: false },
        },
      },
    ]),

    ClientsModule.register([
      {
        name: 'NEST_TO_SPRING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'nest_to_spring_queue',
          queueOptions: { durable: false },
          exchange: 'nest_spring_exchange',
          exchangeType: 'topic',
          routingKey: 'nest_to_spring',
        },
      },
    ]),

    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 587,
        secure: false,
        auth: {
          user: 'b893e8bb7dd03d',
          pass: '2be56f146162ef',
        },
      },
      defaults: {
        from: '"Twoja Apka" <no-reply@twoja-apka.pl>',
      },
    }),
    // CacheModule.register({
    //   isGlobal: true,
    //   useFactory: () => ({
    //     store: redisStore,
    //     host: 'localhost',
    //     port: 6379,
    //     ttl: 10,
    //   }),
    // }),
    // JwtModule.register({
    //   secret: 'secretKey', // W prawdziwym projekcie użyj process.env.JWT_SECRET
    //   signOptions: { expiresIn: '1h' },
    // }),
  ],
})
export class AppModule {}
