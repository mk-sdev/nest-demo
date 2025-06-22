import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

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
    // JwtModule.register({
    //   secret: 'secretKey', // W prawdziwym projekcie użyj process.env.JWT_SECRET
    //   signOptions: { expiresIn: '1h' },
    // }),
  ],
})
export class AppModule {}
