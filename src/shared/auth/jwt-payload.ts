import { UserRole } from '../../user/models/user-role.enum';

export interface JwtPayload {
  username: string;
  role: UserRole;
  // issued at
  iat?: Date;
}
