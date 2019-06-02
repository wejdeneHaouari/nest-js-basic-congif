import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo} from './models/todo.model';

@Module({
  imports: [MongooseModule.forFeature([{name: Todo.modelName, schema: Todo.model.schema}])],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
