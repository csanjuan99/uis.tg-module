import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppealResponse } from '../../application-core/appeal/dto/appeal.dto';
import { FindAppealsInteractor } from '../../application-core/appeal/use-cases/findAppeals.interactor';
import { CountAppealInteractor } from '../../application-core/appeal/use-cases/countAppeal.interactor';
import { FindAppealByIdInteractor } from '../../application-core/appeal/use-cases/findAppealById.interactor';

@ApiTags('Estudiantes')
@Controller('student')
export class StudentController {
  constructor(
    private readonly findAppealsInteractor: FindAppealsInteractor,
    private readonly countAppealInteractor: CountAppealInteractor,
    private readonly findAppealByIdInteractor: FindAppealByIdInteractor,
  ) {}

  @ApiOperation({ summary: 'Listar todas las solicitudes de un estudiante' })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: AppealResponse,
    isArray: true,
  })
  @ApiQuery({ name: 'filter', required: false, example: '{}' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiQuery({ name: 'sort', required: false, example: 'asc' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @Get('/appeals')
  async findAppealsByUser(
    @Query('filter') filter: string,
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Req() req: Request,
  ) {
    return this.findAppealsInteractor.execute(
      {
        ...JSON.parse(filter || '{}'),
        'student.identification': req.user['identification'],
      },
      {},
      {
        limit,
        skip,
        sort: { [sortBy]: sort },
      },
    );
  }

  @ApiOperation({ summary: 'Contar todas las solicitudes de un estudiante' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'filter',
    required: false,
  })
  @ApiOkResponse({
    type: Number,
  })
  @Get('/appeals/count')
  async countAppealsByUser(
    @Req() req: Request,
    @Query('filter') filter: string,
  ) {
    return this.countAppealInteractor.execute({
      ...JSON.parse(filter || '{}'),
      'student.identification': req.user['identification'],
    });
  }

  @ApiOperation({
    summary: 'Buscar una solicitud de un estudiante por identificador',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: AppealResponse,
  })
  @Get('/appeals/:id')
  async findAppealById(@Param('id') id: string) {
    return this.findAppealByIdInteractor.execute(id);
  }
}
