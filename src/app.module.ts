import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
// import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

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
