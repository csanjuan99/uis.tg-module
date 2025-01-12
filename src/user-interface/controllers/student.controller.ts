import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, Req } from '@nestjs/common';
import { FindAppealsByStudentInteractor } from '../../application-core/abstract/student/use-cases/findAppealsByStudent.interactor';
import { Request } from 'express';
import { AppealResponse } from '../../application-core/appeal/dto/appeal.dto';
import { CountAppealsByStudentInteractor } from '../../application-core/abstract/student/use-cases/countAppealsByStudent.interactor';
import { FindStudentAppealByIdInteractor } from '../../application-core/abstract/student/use-cases/findStudentAppealById.interactor';

@ApiTags('Estudiantes')
@Controller('student')
export class StudentController {
  constructor(
    private readonly findAppealsByStudentInteractor: FindAppealsByStudentInteractor,
    private readonly countAppealsByStudentInteractor: CountAppealsByStudentInteractor,
    private readonly findStudentAppealByIdInteractor: FindStudentAppealByIdInteractor,
  ) {}

  @ApiOperation({ summary: 'Listar todas las solicitudes de un estudiante' })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: AppealResponse,
    isArray: true,
  })
  @Get('/appeals')
  async findAppealsByUser(@Req() req: Request) {
    return this.findAppealsByStudentInteractor.execute(req.user);
  }

  @ApiOperation({ summary: 'Contar todas las solicitudes de un estudiante' })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Number,
  })
  @Get('/appeals/count')
  async countAppealsByUser(@Req() req: Request) {
    return this.countAppealsByStudentInteractor.execute(req.user);
  }

  @ApiOperation({
    summary: 'Buscar una solicitud de un estudiante por identificador',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: AppealResponse,
  })
  @Get('/appeals/:id')
  async findAppealById(@Param('id') id: string, @Req() req: Request) {
    return this.findStudentAppealByIdInteractor.execute(id, req.user);
  }
}
