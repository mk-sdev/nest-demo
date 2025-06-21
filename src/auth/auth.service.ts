import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums/role.enum';

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
   * @returns An object containing the access token.
   * @throws UnauthorizedException if the user is not found or the password does not match.
   */
  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username); //* find a user with a provided nick
    if (!user) {
      throw new UnauthorizedException(); // <- ciągle rzuca wyjątek
    }
    //* check if the password matches
    const isPasswordValid: boolean = await bcrypt.compare(pass, user.password);
    console.log('🚀 ~ AuthService ~ isPasswordValid:', isPasswordValid);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    //* if the user is found and the password matches, generate a JWT token and send it back
    const payload = {
      sub: user.userId,
      username: user.username,
      roles: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(username: string, pass: string): Promise<void> {
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(pass, 10); // 10 salt rounds

    this.usersService.addUser({
      userId: Date.now(), // lub inna logika generowania ID
      username,
      password: hashedPassword,
      role: Role.User,
    });
  }
}
