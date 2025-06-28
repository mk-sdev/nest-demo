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
import { accessTokenOptions } from './cookies';
/*
- gdy user prosi o zasoby, najpierw aktywowany jest guard.
- on sprawdza, czy jwt istnieje
  - jeśli nie istnieje jwt, sprawdź czy refresh token istnieje
    - jeśli nie istnieje refresh token, wurzyć błąd i ew. przekieruj gdzies indziej, 
    - jeśli istnieje refresh, porównaj go z tym w bazie
      - jeśli nie są takie same, wyrzuć błąd, ew. przekieruj gdzieś indziej
      - jeśli są takie same, wygeneruj nowy jwt i ustaw w cookie
  - jeśli istnieje jwt, sprawdza jego poprawność i czy nie wygasł
    - jeśli niepoprawny lub wygasł, wyrzuć błąd i ew. przekieruj gdzieś indziej
    - jeśli poprawny i aktualny, przekeiruj do endpointa
*/
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

    //* sprawdza, czy jwt istnieje
    if (jwt) {
      //* jeśli istnieje jwt, sprawdza jego poprawność
      return this.validateAccessToken(jwt, request);
    }

    //* jeśli nie istnieje jwt, sprawdź czy refresh token istnieje
    if (!refreshToken) {
      //* jeśli nie istnieje refresh token, wurzyć błąd i ew. przekieruj gdzies indziej
      throw new UnauthorizedException('Brak refresh tokenu');
    }

    return this.tryRefreshToken(refreshToken, request, response);
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

  private async validateAccessToken(
    token: string,
    request: Request,
  ): Promise<boolean> {
    try {
      // sprawdza czy token nie wygasł oraz czy jest poprawny, a nie np. zmyślony
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      request['user'] = payload;
      return true; //* jeśli poprawny, przekeiruj do endpointa
    } catch (err) {
      console.error('Błąd weryfikacji tokenu:', err);
      //* jeśli niepoprawny, wyrzuć błąd i ew. przekieruj gdzieś indziej
      throw new UnauthorizedException('Nieprawidłowy token');
    }
  }

  private async tryRefreshToken(
    refreshToken: string,
    request: Request,
    response: Response,
  ): Promise<boolean> {
    try {
      const { access_token } = await this.generateNewAccessToken(refreshToken);

      response.cookie('jwt', access_token, accessTokenOptions);

      const payload = await this.jwtService.verifyAsync(access_token, {
        secret: jwtConstants.secret,
      });

      request['user'] = payload;
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

      //* jeśli istnieje refresh, porównaj go z tym w bazie
      if (!user || user.refreshtoken !== refreshToken) {
        //* jeśli nie są takie same, wyrzuć błąd, ew. przekieruj gdzieś indziej
        throw new UnauthorizedException();
      }

      //* jeśli są takie same, wygeneruj nowy jwt i ustaw w cookie
      const access_token = await this.jwtService.signAsync(
        {
          username: user.username,
          roles: user.role,
        },
        { expiresIn: '10s' },
      );

      return { access_token };
    } catch {
      throw new UnauthorizedException('Nieprawidłowy refresh token');
    }
  }
}
