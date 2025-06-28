import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums/role.enum';
import { JWTlifespan, RefreshLifespan } from './cookies';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Signs in a user with the provided username and password.
   * If the user is found and the password matches, it generates a JWT token.
   * @param username - The username of the user.
   * @param pass - The password of the user.
   * @returns An object containing the access token and refresh token.
   * @throws UnauthorizedException if the user is not found or the password does not match.
   */
  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    console.log('🚀 ~ AuthService ~ username:', username);
    const user = await this.usersService.findOne(username); //* find a user with a provided nick
    if (!user) {
      throw new UnauthorizedException();
    }
    //* check if the password matches
    const isPasswordValid: boolean = await bcrypt.compare(pass, user.password);
    console.log('🚀 ~ AuthService ~ pass:', pass);
    console.log('🚀 ~ AuthService ~ user.password:', user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    //* if the user is found and the password matches, generate a JWT token and send it back
    const payload = {
      username: user.username,
      roles: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: JWTlifespan,
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: RefreshLifespan,
    });

    //* zapisz refresh token do bazy
    await this.usersService.updateRefreshToken(user.username, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  async register(username: string, pass: string): Promise<void> {
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(pass, 10); // 10 salt rounds

    await this.usersService.addUser({
      // userId: Date.now(), // lub inna logika generowania ID
      username,
      password: hashedPassword,
      role: Role.User,
    });
  }
}
