import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();
    console.log('🔐 RolesGuard: user =', user);

    if (!requiredRoles) return true;

    if (!user || !user.roles) {
      console.warn('❌ Brak ról użytkownika lub user niezalogowany');
      return false;
    }

    const userRoles = Array.isArray(user.roles)
      ? user.roles
      : typeof user.roles === 'string'
        ? [user.roles]
        : [];

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    console.log('✅ hasRole =', hasRole);
    return hasRole;
  }
}
