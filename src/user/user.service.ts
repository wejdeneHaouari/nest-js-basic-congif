import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { ModelType } from 'typegoose';
import { AuthService } from '../shared/auth/auth.service';
import {JwtPayload} from '../shared/auth/jwt-payload';
import { BaseService } from '../shared/base.service';
import { MapperService } from '../shared/mapper/mapper.service';
import { User } from './models/user.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
import { RegisterVm } from './models/view-models/register-vm.model';
import { UserVm } from './models/view-models/user-vm.model';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.modelName) private readonly userModel: ModelType<User>,
    private readonly mapperService: MapperService,
    @Inject(forwardRef(() => AuthService))
    readonly authService: AuthService,
  ) {
    super();
    this._model = userModel;
    this._mapper = mapperService.mapper;
  }




}
