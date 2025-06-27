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
  Redirect,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Roles } from 'src/enums/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/enums/roles.guard';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { Res } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private mailerService: MailerService,
  ) {}

  @Get('verify')
  async verifyEmail(@Query('email') email: string) {
    console.log(email);
    const verificationUrl = `https://twoja-apka.pl/verify?token=...`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Aktywuj konto',
      html: `Kliknij <a href="${verificationUrl}">tutaj</a>, aby aktywować konto.`,
    });

    return { message: 'Wysłano maila weryfikacyjnego' };
  }

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

  @Post('login')
  @Redirect('profile')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) response: Response, // <- ważne
  ) {
    const { access_token } = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    response.cookie('jwt', access_token, {
      httpOnly: true, // uniemożliwia dostęp do ciasteczka z JS
      secure: false, // ustaw `true` jeśli HTTPS
      sameSite: 'lax', // lub 'strict' / 'none' (zależnie od potrzeb)
      maxAge: 1000 * 60 * 60 * 24, // 1 dzień
    });

    return { message: 'Login successful' };
  }

  @Post('logout')
  @Render('login') // Renderuje widok 'login' po wylogowaniu
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'Logged out successfully' };
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
