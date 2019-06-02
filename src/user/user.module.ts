import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { schema } from 'typegoose/lib/data';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: User.modelName, schema: User.model.schema}])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
