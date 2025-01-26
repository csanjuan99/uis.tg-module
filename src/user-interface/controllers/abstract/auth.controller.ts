import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OnEvent } from '@nestjs/event-emitter';
import { LoginInteractor } from '../../../application-core/abstract/auth/use-cases/login.interactor';
import { RegisterInteractor } from '../../../application-core/abstract/auth/use-cases/register.interactor';
import { VerifyInteractor } from '../../../application-core/abstract/auth/use-cases/verify.interactor';
import { ResendVerifyInteractor } from '../../../application-core/abstract/auth/use-cases/resendVerify.interactor';
import { MeInteractor } from '../../../application-core/abstract/auth/use-cases/me.interactor';
import { LoginRequest } from '../../../application-core/abstract/auth/dto/login.dto';
import { Public } from '../../../application-core/abstract/auth/decorator/public.decorator';
import { JwtResponse } from '../../../application-core/abstract/auth/dto/jwt.dto';
import { RegisterRequest } from '../../../application-core/abstract/auth/dto/register.dto';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';
import { SendVerifyInteractor } from '../../../application-core/abstract/auth/event-handlers/sendVerify.interactor';
import { RecoverPasswordInteractor } from '../../../application-core/abstract/auth/use-cases/recoverPassword.interactor';
import { ChangePasswordInteractor } from '../../../application-core/abstract/auth/use-cases/changePassword.interactor';
import { RecoverPasswordRequest } from '../../../application-core/abstract/auth/dto/recover-password.dto';
import { ChangePasswordRequest } from '../../../application-core/abstract/auth/dto/change-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginInteractor: LoginInteractor,
    private readonly registerInteractor: RegisterInteractor,
    private readonly verifyInteractor: VerifyInteractor,
    private readonly resendVerifyInteractor: ResendVerifyInteractor,
    private readonly sendVerifyInteractor: SendVerifyInteractor,
    private readonly meInteractor: MeInteractor,
    private readonly changePasswordInteractor: ChangePasswordInteractor,
    private readonly recoverPasswordInteractor: RecoverPasswordInteractor,
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
  async register(
    @Body() payload: RegisterRequest,
    @Req() req: Request,
  ): Promise<UserDocument> {
    return await this.registerInteractor.execute(payload, req);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user information' })
  @ApiOkResponse({ description: 'User object' })
  @HttpCode(HttpStatus.OK)
  @Get('user')
  async user(@Req() req: Request): Promise<Express.User> {
    return this.meInteractor.execute(req.user['id']);
  }

  @Public()
  @ApiOperation({ summary: 'Verificar cuenta de estudiante' })
  @ApiOkResponse({ description: 'Cuenta verificada' })
  @ApiUnauthorizedResponse({ description: 'No se pudo otorgar acceso' })
  @ApiNotFoundResponse({ description: 'No se encontró un usuario asociado' })
  @ApiForbiddenResponse({ description: 'Fallo al verificar la cuenta' })
  @ApiQuery({
    name: 't',
    required: true,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.***',
  })
  @Get('/verify')
  async verify(@Req() req: Request, @Res() res: Response): Promise<void> {
    return await this.verifyInteractor.execute(req, res);
  }

  @Public()
  @ApiQuery({
    name: 't',
    required: true,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.***',
  })
  @ApiOperation({ summary: 'Reenviar correo de verificación' })
  @ApiOkResponse({ description: 'Correo de verificación reenviado' })
  @ApiUnauthorizedResponse({ description: 'No se pudo otorgar acceso' })
  @ApiNotFoundResponse({ description: 'No se encontró un usuario asociado' })
  @Get('/resend-verify')
  async resendVerify(@Req() req: Request, @Res() res: Response): Promise<void> {
    return await this.resendVerifyInteractor.execute(req, res);
  }

  @ApiOperation({ summary: 'Enviar enlace de recuperación' })
  @Public()
  @Post('recover-password')
  async recoverPassword(
    @Req() req: Request,
    @Body() payload: RecoverPasswordRequest,
  ) {
    return this.recoverPasswordInteractor.execute(req, payload);
  }

  @ApiOperation({ summary: 'Cambiar contraseña' })
  @ApiQuery({
    name: 't',
    required: true,
  })
  @Public()
  @Post('change-password')
  async changePassword(
    @Req() req: Request,
    @Body() payload: ChangePasswordRequest,
  ) {
    return this.changePasswordInteractor.execute(
      req.query.t as string,
      payload,
    );
  }
}
