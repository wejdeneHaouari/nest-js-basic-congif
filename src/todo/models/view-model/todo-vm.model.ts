import { ApiModelProperty } from '@nestjs/swagger';
import { TodoLevel } from '../todo-level.enum';
import { BaseModel, BaseModelVm } from '../../../shared/base.module';
import { Todo } from '../todo.model';

export class TodoVm extends BaseModelVm {
  @ApiModelProperty() content: string;
  @ApiModelProperty({ enum: TodoLevel })
  level: TodoLevel;
  @ApiModelProperty() isCompleted: boolean;
}

