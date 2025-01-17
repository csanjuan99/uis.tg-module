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
import { CreateScheduleInteractor } from '../../application-core/schedule/use-cases/createSchedule.interactor';
import { FindScheduleInteractor } from '../../application-core/schedule/use-cases/findSchedule.interactor';
import { FindScheduleByIdInteractor } from '../../application-core/schedule/use-cases/findScheduleById.interactor';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateScheduleRequest,
  ScheduleResponse,
  UpdateScheduleRequest,
} from '../../application-core/schedule/dto/schedule.dto';
import { Permission } from '../../application-core/abstract/auth/decorator/permission.decorator';
import { CountSchedulesInteractor } from '../../application-core/schedule/use-cases/countSchedules.interactor';
import { DeleteScheduleByIdInteractor } from '../../application-core/schedule/use-cases/deleteScheduleById.interactor';
import { UpdateScheduleByIdInteractor } from '../../application-core/schedule/use-cases/updateScheduleById.interactor';

@ApiTags('Horario')
@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly createScheduleInteractor: CreateScheduleInteractor,
    private readonly findScheduleInteractor: FindScheduleInteractor,
    private readonly findScheduleByIdInteractor: FindScheduleByIdInteractor,
    private readonly countScheduleInteractor: CountSchedulesInteractor,
    private readonly deleteScheduleByIdInteractor: DeleteScheduleByIdInteractor,
    private readonly updateScheduleByIdInteractor: UpdateScheduleByIdInteractor,
  ) {}

  @ApiOperation({
    summary: 'Listar y filtrar los horarios',
  })
  @ApiOkResponse({
    type: ScheduleResponse,
    isArray: true,
  })
  @Permission('*')
  @Get()
  async find(
    @Query('filter') filter: string,
    @Query('projection') projection: string,
  ) {
    return this.findScheduleInteractor.execute(
      {
        ...JSON.parse(filter || '{}'),
      },
      {
        ...JSON.parse(projection || '{}'),
      },
    );
  }

  @ApiOperation({
    summary: 'Contar los horarios',
  })
  @ApiOkResponse({
    type: Number,
  })
  @Permission('*')
  @Get('/count')
  async count(@Query('filter') filter: string) {
    return this.countScheduleInteractor.execute({
      ...JSON.parse(filter || '{}'),
    });
  }

  @ApiOperation({
    summary: 'Crear un horario',
  })
  @ApiOkResponse({
    type: ScheduleResponse,
  })
  @Permission('*', 'write:schedule')
  @Post()
  async create(@Body() payload: CreateScheduleRequest) {
    return this.createScheduleInteractor.execute(payload);
  }

  @ApiOperation({
    summary: 'Buscar un horario por identificador',
  })
  @ApiOkResponse({
    type: ScheduleResponse,
  })
  @Permission('*', 'read:schedule')
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.findScheduleByIdInteractor.execute(id);
  }

  @ApiOperation({
    summary: 'Eliminar un horario por identificador',
  })
  @ApiOkResponse({
    type: ScheduleResponse,
  })
  @Permission('*', 'delete:schedule')
  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.deleteScheduleByIdInteractor.execute(id);
  }

  @ApiOperation({
    summary: 'Actualizar un horario por identificador',
  })
  @ApiOkResponse({
    type: ScheduleResponse,
  })
  @Permission('*', 'write:schedule')
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() payload: UpdateScheduleRequest,
  ) {
    return this.updateScheduleByIdInteractor.execute(id, payload);
  }
}
