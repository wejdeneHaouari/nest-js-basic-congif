import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../user-role.enum';
import { BaseModelVm } from '../../../shared/base.module';

export class UserVm extends BaseModelVm {
  @ApiModelProperty() username: string;
  @ApiModelPropertyOptional() firstName?: string;
  @ApiModelPropertyOptional() lastName?: string;
  @ApiModelPropertyOptional() fullName?: string;
  @ApiModelPropertyOptional({ enum: UserRole })
  role?: UserRole;
}
