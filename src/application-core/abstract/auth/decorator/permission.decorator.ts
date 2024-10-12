import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'roles';
export const Permission = (...roles: string[]) =>
  SetMetadata(PERMISSION_KEY, roles);
