import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FindUsersInteractor } from '../../application-core/user/use-cases/findUsers.interactor';
import { UserDocument } from '../../infrastructure/persistence/schema/user.schema';
import { Permission } from '../../application-core/abstract/auth/decorator/permission.decorator';
import { CountUsersInteractor } from '../../application-core/user/use-cases/countUsers.interactor';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../../application-core/user/dto/user.dto';
import { DeleteUserByIdInteractor } from '../../application-core/user/use-cases/deleteUserById.interactor';
import { FindUserByIdInteractor } from '../../application-core/user/use-cases/findUserById.interactor';
import { CreateUserInteractor } from '../../application-core/user/use-cases/createUser.interactor';
import { UpdateUserByIdInteractor } from '../../application-core/user/use-cases/updateUserById.interactor';

@ApiTags('Usuarios - Administrador')
@Controller('users')
export class UserController {
  constructor(
    private readonly findUsersInteractor: FindUsersInteractor,
    private readonly countUsersInteractor: CountUsersInteractor,
    private readonly findUserByIdInteractor: FindUserByIdInteractor,
    private readonly deleteUserByIdInteractor: DeleteUserByIdInteractor,
    private readonly createUserInteractor: CreateUserInteractor,
    private readonly updateUserByIdInteractor: UpdateUserByIdInteractor,
  ) {}

  @ApiOperation({ summary: 'Listar y filtrar todos los usuarios' })
  @ApiOkResponse({
    type: UserResponse,
    isArray: true,
  })
  @ApiBearerAuth()
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiQuery({ name: 'sort', required: false, example: 'asc' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'filter', required: false, example: '{}' })
  @Permission('*')
  @Get()
  async find(
    @Query('filter') filter: string,
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('sortBy') sortBy: string = 'createdAt',
  ): Promise<UserDocument[]> {
    return this.findUsersInteractor.execute(
      {
        ...JSON.parse(filter || '{}'),
      },
      {
        password: 0,
      },
      {
        limit,
        skip,
        sort: { [sortBy]: sort },
      },
    );
  }

  @ApiOperation({ summary: 'Contar todos los usuarios' })
  @ApiQuery({ name: 'filter', required: false, example: '{}' })
  @ApiOkResponse({ type: Number })
  @ApiBearerAuth()
  @Permission('*')
  @Get('/count')
  async count(@Query('filter') filter: string): Promise<number> {
    return this.countUsersInteractor.execute({
      ...JSON.parse(filter || '{}'),
    });
  }

  @ApiOperation({ summary: 'Listar un usuario por su identificador' })
  @ApiOkResponse({ type: UserResponse })
  @ApiBearerAuth()
  @Permission('*')
  @Get(':id')
  async findById(@Query('id') id: string): Promise<UserDocument> {
    return this.findUserByIdInteractor.execute(id, {
      password: 0,
    });
  }

  @ApiOperation({ summary: 'Eliminar un usuario por su identificador' })
  @ApiOkResponse({ type: UserResponse })
  @ApiBearerAuth()
  @Permission('*')
  @Delete(':id')
  async deleteById(@Query('id') id: string): Promise<UserDocument> {
    return this.deleteUserByIdInteractor.execute(id);
  }

  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiBearerAuth()
  @Permission('*')
  @Post('/')
  async create(@Body() user: CreateUserRequest): Promise<UserDocument> {
    return this.createUserInteractor.execute(user);
  }

  @ApiOperation({ summary: 'Actualizar un usuario por su identificador' })
  @ApiOkResponse({ type: UserResponse })
  @ApiBearerAuth()
  @Permission('*')
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() payload: UpdateUserRequest,
  ): Promise<UserDocument> {
    return this.updateUserByIdInteractor.execute(id, payload);
  }
}
