import { BadRequestException, Injectable } from '@nestjs/common';
import { ScheduleGateway } from '../../../infrastructure/persistence/gateway/shedule.gateway';
import { ScheduleDocument } from '../../../infrastructure/persistence/schema/schedule.schema';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { FindUserByIdInteractor } from '../../user/use-cases/findUserById.interactor';
import { CreateScheduleRequest } from '../dto/schedule.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateScheduleInteractor {
  constructor(
    private readonly findUserByIdInteractor: FindUserByIdInteractor,
    private readonly userGateway: UserGateway,
    private readonly scheduleGateway: ScheduleGateway,
    private readonly configService: ConfigService,
  ) {}

  async execute(payload: CreateScheduleRequest): Promise<ScheduleDocument> {
    const student: UserDocument = await this.findUserByIdInteractor.execute(
      payload.student['id'],
    );

    const _schedule: ScheduleDocument = await this.scheduleGateway.findOne({
      student: student.id,
    });

    if (_schedule) {
      throw new BadRequestException(
        'El estudiante ya tiene un horario asignado',
      );
    }

    const period = {
      year: parseInt(this.configService.get<string>('ACADEMIC_YEAR', '2025')),
      term: parseInt(this.configService.get<string>('ACADEMIC_TERM', '1')),
    };

    return await this.scheduleGateway.create({
      subjects: payload.subjects,
      student,
      period,
    });
  }
}
