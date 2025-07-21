import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { PrismaModule } from 'prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';
// import { join } from 'path';
import { NadawcaModule } from './nadawca/nadawca.module';
import { OdbiorcaModule } from './odbiorca/odbiorca.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '',
    //   database: 'scrabble',
    //   autoLoadEntities: true,
    //   synchronize: true, // tylko w dev — w produkcji = false
    // }),
    MongooseModule.forRoot('mongodb://localhost:27017/nestdb'),
    ConfigModule.forRoot({
      isGlobal: true, // ← umożliwia korzystanie z .env w całej aplikacji
    }),
    // PrismaModule,

    // serwis emitujący

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

    OdbiorcaModule,

    NadawcaModule,
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
