import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TasksModule,
    AuthModule,
    UsersModule,
    // JwtModule.register({
    //   secret: 'secretKey', // W prawdziwym projekcie użyj process.env.JWT_SECRET
    //   signOptions: { expiresIn: '1h' },
    // }),
  ],
})
export class AppModule {}
