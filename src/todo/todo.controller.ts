import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiOkResponse, ApiCreatedResponse,  ApiBadRequestResponse , ApiImplicitQuery } from '@nestjs/swagger';
import { Todo } from './models/todo.model';
import { TodoService } from './todo.service';
import { TodoVm } from './models/view-model/todo-vm.model';
import { promises } from 'fs';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { map } from 'lodash';
import { TodoParams } from './models/view-model/todo-params.model';
import { TodoLevel } from './models/todo-level.enum';
import { isArray } from 'util';
import { ToBooleanPipe } from '../shared/pipes/to-boolean.pipe';
import { EnumToArray } from '../shared/utilities/enum-to-array';

@Controller('todos')
@ApiUseTags(Todo.modelName)
export class TodoController {
  constructor(private readonly todoService: TodoService){}

  @Post()
  @ApiCreatedResponse({ type: TodoVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(Todo.modelName, 'Create'))
  async create(@Body() params: TodoParams): Promise<TodoVm> {
    try {
      const newTodo = await this.todoService.createTodo(params);
      return this.todoService.map<TodoVm>(newTodo);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOkResponse({ type: TodoVm, isArray: true })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(Todo.modelName, 'GetAll'))
  @ApiImplicitQuery({ name: 'level', enum: EnumToArray(TodoLevel), required: false, isArray: true })
  @ApiImplicitQuery({ name: 'isCompleted', required: false })
  async get(
    @Query('level') level?: TodoLevel,
    @Query('isCompleted', new ToBooleanPipe())
      isCompleted?: boolean,
  ): Promise<TodoVm[]> {
    let filter = {};

    if (level) {
      filter['level'] = { $in: isArray(level) ? [...level] : [level] };
    }

    if (isCompleted !== null) {
      if (filter['level']) {
        filter = { $and: [{ level: filter['level'] }, { isCompleted }] };
      } else {
        filter['isCompleted'] = isCompleted;
      }
    }

    try {
      const todos = await this.todoService.findAll(filter);
      return this.todoService.map<TodoVm[]>(map(todos, todo => todo.toJSON()));
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @ApiResponse({ status: HttpStatus.CREATED, type: TodoVm})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException})
  @ApiOperation(GetOperationId(Todo.modelName, 'Update'))
  async update(@Body() vm: TodoVm): Promise<TodoVm> {
     const { id, content, level, isCompleted } = vm;
     if (!vm || !id) {
       throw new HttpException(`Missing parameters`, HttpStatus.BAD_REQUEST);
     }
     const exist = await this.todoService.findById(id);

     if (!exist) {
       throw new HttpException(`${id} Not Found`, HttpStatus.NOT_FOUND);
     }

     if (exist.isCompleted) {
       throw new HttpException('Already completed', HttpStatus.BAD_REQUEST);
     }
     exist.content = content;
     exist.level = level;
     exist.isCompleted = isCompleted;

     try {
       const updated = await this.todoService.update(id, exist);
       return this.todoService.map<TodoVm>(updated.toJSON());
     } catch (e) {
       throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
     }
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, type: TodoVm})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException})
  @ApiOperation(GetOperationId(Todo.modelName, 'Delete'))
  async delete(@Param('id') id: string): Promise<TodoVm> {
    try {
      const deleted = await this.todoService.delete(id);
      return this.todoService.map<TodoVm>(deleted.toJSON());
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }
}
