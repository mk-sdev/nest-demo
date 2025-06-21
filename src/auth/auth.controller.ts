import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  Render,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/enums/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/enums/roles.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get()
  getAllUsers(): Promise<Record<string, any>[]> {
    return this.usersService.getAllUsers();
  }
  @Get('login')
  @Render('login') // Renderuje widok 'login' przy żądaniu GET na /auth/login
  getLoginPage() {
    return { message: 'Please log in' }; // Możesz przekazać dodatkowe dane do widoku
  }

  @Get('register')
  @Render('register') // Renderuje widok 'login' przy żądaniu GET na /auth/login
  getRegisterPage() {
    return { message: 'Please log in' }; // Możesz przekazać dodatkowe dane do widoku
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: Record<string, any>) {
    // Here you would typically call a user service to create a new user
    // For simplicity, we are just returning the registration data
    await this.authService.register(registerDto.username, registerDto.password);
    return {
      message: 'User registered successfully',
    };
  }

  @Get('profile') // dostęp tylko dla zalogowanych użytkowników
  @UseGuards(AuthGuard)
  @Render('profile')
  getProfile(@Request() req) {
    return { username: req.user.username };
  }

  @Get('admin') // tylko dla zalogowanych administratorów
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getAdminData() {
    return 'Tylko dla adminów!';
  }
}
