import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';
import {
  accessTokenOptions,
  JWTlifespan,
  RefreshLifespan,
  refreshTokenOptions,
} from './cookies';
import { TokenExpiredError } from 'jsonwebtoken'; // <-- dodaj import

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { jwt, refreshToken } = this.extractTokens(request);

    if (jwt) {
      try {
        return await this.validateAccessToken(jwt, request);
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          // Jeśli token wygasł, spróbuj odświeżyć token przy pomocy refresh tokena
          if (!refreshToken) {
            throw new UnauthorizedException('Brak refresh tokenu');
          }
          return this.tryRefreshToken(refreshToken, request, response);
        }
        // Inne błędy weryfikacji tokenu
        throw error;
      }
    }

    if (!refreshToken) {
      throw new UnauthorizedException('Brak refresh tokenu');
    }

    return this.tryRefreshToken(refreshToken, request, response);
  }

  private async validateAccessToken(
    token: string,
    request: Request,
  ): Promise<boolean> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    request['user'] = payload;
    return true;
  }

  private extractTokens(request: Request): {
    jwt?: string;
    refreshToken?: string;
  } {
    return {
      jwt: request.cookies?.jwt,
      refreshToken: request.cookies?.refresh,
    };
  }

  private async tryRefreshToken(
    refreshToken: string,
    request: Request,
    response: Response,
  ): Promise<boolean> {
    try {
      // Weryfikuj refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.usersService.findOne(payload.username);

      if (!user || user.refreshtoken !== refreshToken) {
        throw new UnauthorizedException();
      }

      // Generuj nowy access token
      const newAccessToken = await this.jwtService.signAsync(
        {
          username: user.username,
          roles: [user.role], // roles zamiast role
        },
        { expiresIn: JWTlifespan },
      );

      // Generuj nowy refresh token - np. na 7 dni
      const newRefreshToken = await this.jwtService.signAsync(
        { username: user.username },
        { expiresIn: RefreshLifespan },
      );

      // Zapisz nowy refresh token w bazie
      await this.usersService.updateRefreshToken(
        user.username,
        newRefreshToken,
      );

      // Ustaw oba tokeny w cookie
      response.cookie('jwt', newAccessToken, accessTokenOptions);
      response.cookie('refresh', newRefreshToken, refreshTokenOptions);

      // Ustaw payload usera w request
      request['user'] = await this.jwtService.verifyAsync(newAccessToken, {
        secret: jwtConstants.secret,
      });

      return true;
    } catch (err) {
      console.error('Błąd przy odświeżaniu tokenu:', err);
      throw new UnauthorizedException('Nie można odświeżyć tokenu');
    }
  }

  private async generateNewAccessToken(
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.usersService.findOne(payload.username);

      if (!user || user.refreshtoken !== refreshToken) {
        throw new UnauthorizedException();
      }

      const access_token = await this.jwtService.signAsync(
        {
          username: user.username,
          roles: [user.role],
        },
        { expiresIn: '10s' }, // dla testów – wydłuż w produkcji
      );

      return { access_token };
    } catch {
      throw new UnauthorizedException('Nieprawidłowy refresh token');
    }
  }
}
