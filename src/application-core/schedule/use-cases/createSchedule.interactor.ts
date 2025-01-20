import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ScheduleGateway } from '../../../infrastructure/persistence/gateway/shedule.gateway';
import {
  Schedule,
  ScheduleDocument,
} from '../../../infrastructure/persistence/schema/schedule.schema';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { FindUserByIdInteractor } from '../../user/use-cases/findUserById.interactor';

@Injectable()
export class CreateScheduleInteractor {
  constructor(
    private readonly findUserByIdInteractor: FindUserByIdInteractor,
    private readonly userGateway: UserGateway,
    private readonly scheduleGateway: ScheduleGateway,
  ) {}

  async execute(payload: Schedule): Promise<ScheduleDocument> {
    const student: UserDocument = await this.findUserByIdInteractor.execute(
      payload.studentId,
    );

    if (!student) {
      throw new NotFoundException('No pudimos encontrar al estudiante');
    }

    const _schedule: ScheduleDocument = await this.scheduleGateway.findOne({
      studentId: student.id,
    });

    if (_schedule) {
      throw new BadRequestException(
        'El estudiante ya tiene un horario asignado',
      );
    }

    return await this.scheduleGateway.create(payload);
  }
}
