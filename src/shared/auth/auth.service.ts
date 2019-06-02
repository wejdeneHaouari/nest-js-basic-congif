import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { User } from '../../user/models/user.model';
import { UserService } from '../../user/user.service';
import { Configuration } from '../configuration/configuration.enum';
import { ConfigurationService } from '../configuration/configuration.service';
import {JwtPayload} from './jwt-payload';
import { RegisterVm } from '../../user/models/view-models/register-vm.model';
import { compare, genSalt, hash } from 'bcryptjs';
import { LoginVm } from '../../user/models/view-models/login-vm.model';
import { LoginResponseVm } from '../../user/models/view-models/login-response-vm.model';
import { UserVm } from '../../user/models/view-models/user-vm.model';

@Injectable()
export class AuthService {
  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string;

  constructor(
    @Inject(forwardRef(() => UserService))
    readonly userService: UserService,
    private readonly configurationService: ConfigurationService,
  ) {
    this.jwtOptions = { expiresIn: '12h' };
    this.jwtKey = configurationService.get(Configuration.JWT_KEY);
  }

  async signPayload(payload: JwtPayload): Promise<string> {
    return sign(payload, this.jwtKey, this.jwtOptions);
  }

  async validateUser(validatePayload: JwtPayload): Promise<User> {
    return this.userService.findOne({ username: validatePayload.username.toLowerCase() });
  }
  async register(vm: RegisterVm) {
    const { username, password, firstName, lastName } = vm;

    const newUser = User.createModel();
    newUser.username = username.trim().toLowerCase();
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    const salt = await genSalt(10);
    newUser.password = await hash(password, salt);

    try {
      const result = await this.userService.create(newUser);
      return result.toJSON() as User;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async login(vm: LoginVm): Promise<LoginResponseVm> {
    const { username, password } = vm;

    const user = await this.userService.findOne({ username });

    if (!user) {
      throw new HttpException('Invalid crendentials', HttpStatus.NOT_FOUND);
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      console.log(user.password);
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    const payload: JwtPayload = {
      username: user.username,
      role: user.role,
    };

    const token = await this.signPayload(payload);
    const userVm: UserVm = await this.userService.map<UserVm>(user.toJSON());

    return {
      token,
      user: userVm,
    };
  }
}
