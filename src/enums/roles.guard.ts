import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// Reflector pozwala odczytywać metadane ustawione np. przez dekoratory
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
// Stała kluczowa używana do odczytu metadanych z dekoratora @Roles
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Odczytaj wszystkie metadane przypisane przez dekorator @Roles
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // najpierw sprawdza dekorator na metodzie
      context.getClass(), // potem sprawdza dekorator na całym kontrolerze
    ]);

    // Jeśli nie ustawiono żadnych ról — dostęp dozwolony dla każdego
    if (!requiredRoles) {
      return true;
    }

    // Pobierz użytkownika z requestu (ustawiony wcześniej w AuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Sprawdź, czy jakakolwiek z ról wymaganych pasuje do ról użytkownika
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
