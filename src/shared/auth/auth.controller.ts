import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { User } from '../../user/models/user.model';
import { AuthService } from './auth.service';
import { UserVm } from '../../user/models/view-models/user-vm.model';
import { ApiException } from '../api-exception.model';
import { GetOperationId } from '../utilities/get-operation-id';
import { RegisterVm } from '../../user/models/view-models/register-vm.model';
import { UserService } from '../../user/user.service';
import { LoginResponseVm } from '../../user/models/view-models/login-response-vm.model';
import { LoginVm } from '../../user/models/view-models/login-vm.model';


@Controller('auth')
@ApiUseTags(User.modelName)
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly userService: UserService) {}

  @Post('register')
  @ApiCreatedResponse({ type: UserVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'Register'))
  async register(@Body() vm: RegisterVm): Promise<UserVm> {
    const { username, password } = vm;

    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    let exist;
    try {
      exist = await this.userService.findOne({ username });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (exist) {
      throw new HttpException(`${username} exists`, HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.authService.register(vm);
    return this.userService.map<UserVm>(newUser);
  }

  @Post('login')
  @ApiCreatedResponse({ type: LoginResponseVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'Login'))
  async login(@Body() vm: LoginVm): Promise<LoginResponseVm> {
    const fields = Object.keys(vm);
    fields.forEach(field => {
      if (!vm[field]) {
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
      }
    });

    return this.authService.login(vm);
  }
}
