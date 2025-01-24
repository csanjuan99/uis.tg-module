import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { CreateAppealInteractor } from '../../application-core/appeal/use-cases/createAppeal.interactor';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  AppealResponse,
  CreateAppealRequest,
  UpdateAppealRequest,
} from '../../application-core/appeal/dto/appeal.dto';
import { Permission } from '../../application-core/abstract/auth/decorator/permission.decorator';
import { FindAppealsInteractor } from '../../application-core/appeal/use-cases/findAppeals.interactor';
import { AppealDocument } from '../../infrastructure/persistence/schema/appeal.schema';
import { FindAppealByIdInteractor } from '../../application-core/appeal/use-cases/findAppealById.interactor';
import { UpdateAppealByIdInteractor } from '../../application-core/appeal/use-cases/updateAppealById.interactor';
import { DeleteAppealByIdInteractor } from '../../application-core/appeal/use-cases/deleteAppealById.interactor';
import { CountAppealInteractor } from '../../application-core/appeal/use-cases/countAppeal.interactor';
import { StudentInterceptor } from '../inteceptors/student.interceptor';
import { OwnerInterceptor } from '../inteceptors/owner.interceptor';
import { Request } from 'express';
import { AppealInterceptor } from '../inteceptors/appeal.interceptor';

@ApiTags('Solicitudes')
@Controller('appeal')
export class AppealController {
  constructor(
    private readonly createAppealInteractor: CreateAppealInteractor,
    private readonly findAppealsInteractor: FindAppealsInteractor,
    private readonly findAppealByIdInteractor: FindAppealByIdInteractor,
    private readonly updateAppealByIdInteractor: UpdateAppealByIdInteractor,
    private readonly deleteAppealByIdInteractor: DeleteAppealByIdInteractor,
    private readonly countAppealInteractor: CountAppealInteractor,
  ) {}

  @ApiCreatedResponse({
    description: 'La solicitud ha sido creada',
  })
  @ApiOperation({ summary: 'Crear una solicitud de cambio en el horario' })
  @ApiBearerAuth()
  @UseInterceptors(StudentInterceptor)
  @Permission('write:appeal')
  @Post('/')
  async create(
    @Body()
    payload: CreateAppealRequest,
  ) {
    return this.createAppealInteractor.execute(payload);
  }

  @Get('/')
  @ApiOperation({ summary: 'Listar y filtrar todas las solicitudes' })
  @ApiOkResponse({
    type: AppealResponse,
    isArray: true,
  })
  @ApiQuery({ name: 'filter', required: false, example: '{}' })
  @ApiQuery({ name: 'projection', required: false, example: '{}' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiQuery({ name: 'sort', required: false, example: 'asc' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiBearerAuth()
  @UseInterceptors(OwnerInterceptor)
  @Permission('*', 'read:appeal')
  async find(
    @Query('filter') filter: string,
    @Query('projection') projection: string,
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Req() req: Request,
  ): Promise<AppealDocument[]> {
    return this.findAppealsInteractor.execute(
      {
        ...JSON.parse(filter || '{}'),
        [req.user['identification'] ? 'student.identification' : '']:
          req.user['identification'],
      },
      {
        ...JSON.parse(projection || '{}'),
      },
      {
        limit,
        skip,
        sort: { [sortBy]: sort },
      },
    );
  }

  @ApiOperation({ summary: 'Contar todas las solicitudes' })
  @ApiOkResponse({
    type: Number,
  })
  @ApiBearerAuth()
  @ApiQuery({ name: 'filter', required: false, example: '{}' })
  @Permission('*', 'read:appeal')
  @UseInterceptors(OwnerInterceptor)
  @Get('/count')
  async count(
    @Query('filter') filter: string,
    @Req() req: Request,
  ): Promise<number> {
    return this.countAppealInteractor.execute({
      ...JSON.parse(filter || '{}'),
      [req.user['identification'] ? 'student.identification' : '']:
        req.user['identification'],
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar una solicitud por su id' })
  @ApiOkResponse({
    type: AppealResponse,
  })
  @ApiParam({ name: 'id', required: true })
  @ApiNotFoundResponse({ description: 'Solicitud no encontrada' })
  @UseInterceptors(OwnerInterceptor)
  @Permission('*', 'read:appeal')
  @Get(':id')
  async findById(@Param('id') id: string): Promise<AppealDocument> {
    return this.findAppealByIdInteractor.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una solicitud por su id' })
  @ApiNotFoundResponse({ description: 'Solicitud no encontrada' })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseInterceptors(AppealInterceptor)
  @Permission('*', 'update:appeal')
  async updateById(
    @Param('id') id: string,
    @Body() payload: UpdateAppealRequest,
  ) {
    return this.updateAppealByIdInteractor.execute(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una solicitud por su id' })
  @ApiNotFoundResponse({ description: 'Solicitud no encontrada' })
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @UseInterceptors(OwnerInterceptor)
  @Permission('*', 'delete:appeal')
  async deleteById(@Param('id') id: string) {
    return this.deleteAppealByIdInteractor.execute(id);
  }
}
