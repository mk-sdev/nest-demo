import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // Pobranie obiektu `Request` z kontekstu HTTP
    const token = this.extractTokenFromHeader(request); // Próba wyciągnięcia tokenu JWT z nagłówków

    if (!token) {
      // Jeśli token nie istnieje, zgłoś wyjątek 401 Unauthorized
      throw new UnauthorizedException();
    }

    try {
      // Weryfikacja tokenu JWT — sprawdzamy, czy nie jest sfałszowany lub przeterminowany
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret, // Klucz użyty do podpisania tokenu
      });

      // Jeżeli weryfikacja się powiedzie, przypisujemy dane z tokenu (payload) do obiektu request
      // Dzięki temu dane będą dostępne w kontrolerze przez `@Request() req`
      request['user'] = payload;
    } catch {
      // Jeśli weryfikacja się nie powiedzie (np. nieprawidłowy podpis), rzucamy wyjątek 401
      throw new UnauthorizedException();
    }

    // Jeśli wszystko przebiegło pomyślnie, zezwalamy na dostęp do zasobu
    return true;
  }

  // Prywatna metoda pomocnicza do wyciągnięcia tokenu z nagłówka Authorization
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []; // Dzielimy np. "Bearer <token>"
    return type === 'Bearer' ? token : undefined; // Sprawdzamy, czy to token typu Bearer
  }
}
