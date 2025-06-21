import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

// SetMetadata(key, value) ustawia dane metadanych dla danego kontrolera lub metody.
// NestJS później odczytuje te metadane w strażniku (Guard), np. RolesGuard, aby sprawdzić, czy użytkownik ma odpowiednią rolę.
// Ten dekorator ustawia metadane { roles: ['admin'] } na tej trasie. Guard (np. RolesGuard) może je potem odczytać i porównać z rolami użytkownika.
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
