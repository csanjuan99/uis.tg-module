import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { LoginInteractor } from '../../application-core/abstract/auth/use-cases/login.interactor';
import { Request } from 'express';
import { Public } from '../../application-core/abstract/auth/decorator/public.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterInteractor } from '../../application-core/abstract/auth/use-cases/register.interactor';
import { LoginRequest } from '../../application-core/abstract/auth/dto/login.dto';
import { RegisterRequest } from '../../application-core/abstract/auth/dto/register.dto';
import { JwtResponse } from '../../application-core/abstract/auth/dto/jwt.dto';
import { UserDocument } from '../../infrastructure/persistence/schema/user.schema';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginInteractor: LoginInteractor,
    private readonly registerInteractor: RegisterInteractor,
  ) {}

  @ApiOperation({ summary: 'Get a JWT token' })
  @ApiOkResponse({ description: 'JWT token' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('/login')
  async login(@Body() payload: LoginRequest): Promise<JwtResponse> {
    return await this.loginInteractor.execute(payload);
  }

  @ApiOperation({ summary: 'Create student account' })
  @ApiCreatedResponse({ description: 'User created' })
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async register(@Body() payload: RegisterRequest): Promise<UserDocument> {
    return await this.registerInteractor.execute(payload);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user information' })
  @ApiOkResponse({ description: 'User object' })
  @HttpCode(HttpStatus.OK)
  @Get('user')
  async user(@Req() req: Request): Promise<Express.User> {
    return req.user;
  }
}
