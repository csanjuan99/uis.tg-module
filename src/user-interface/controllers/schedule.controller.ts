import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateScheduleInteractor } from '../../application-core/schedule/use-cases/createSchedule.interactor';
import { FindScheduleInteractor } from '../../application-core/schedule/use-cases/findSchedule.interactor';
import { FindScheduleByIdInteractor } from '../../application-core/schedule/use-cases/findScheduleById.interactor';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateScheduleRequest,
  ScheduleResponse,
  UpdateScheduleRequest,
} from '../../application-core/schedule/dto/schedule.dto';
import { Permission } from '../../application-core/abstract/auth/decorator/permission.decorator';
import { CountSchedulesInteractor } from '../../application-core/schedule/use-cases/countSchedules.interactor';
import { DeleteScheduleByIdInteractor } from '../../application-core/schedule/use-cases/deleteScheduleById.interactor';
import { UpdateScheduleByIdInteractor } from '../../application-core/schedule/use-cases/updateScheduleById.interactor';
import { StudentInterceptor } from '../inteceptors/student.interceptor';

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
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'projection',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
  })
  @Permission('*')
  @Get()
  async find(
    @Query('filter') filter: string,
    @Query('projection') projection: string,
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('sortBy') sortBy: string = 'createdAt',
  ) {
    return this.findScheduleInteractor.execute(
      {
        ...JSON.parse(filter || '{}'),
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

  @ApiOperation({
    summary: 'Contar los horarios',
  })
  @ApiOkResponse({
    type: Number,
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
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
  @ApiBearerAuth()
  @UseInterceptors(StudentInterceptor)
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
  @Permission('read:schedule')
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
  @UseInterceptors(StudentInterceptor)
  @Permission('delete:schedule')
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
  @UseInterceptors(StudentInterceptor)
  @Permission('write:schedule')
  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() payload: UpdateScheduleRequest,
  ) {
    return this.updateScheduleByIdInteractor.execute(id, payload);
  }
}
