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
import { LoginDto } from '../../application-core/abstract/auth/dto/login.dto';
import { Request } from 'express';
import { Public } from '../../application-core/abstract/auth/decorator/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '../../application-core/abstract/auth/decorator/permission.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginInteractor: LoginInteractor) {}

  @ApiOperation({ summary: 'Get a JWT token' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Body() payload: LoginDto): Promise<string> {
    return await this.loginInteractor.execute(payload);
  }

  @ApiOperation({ summary: 'Get user information' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @Get('user')
  async user(@Req() req: Request): Promise<Express.User> {
    return req.user;
  }
}
