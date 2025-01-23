import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Put, UseInterceptors } from '@nestjs/common';
import { UpdateStudentInteractor } from '../../../application-core/abstract/student/use-cases/UpdateStudent.interactor';
import { UpdateStudentRequest } from '../../../application-core/abstract/student/dto/student.dto';
import { OwnerInterceptor } from '../../inteceptors/owner.interceptor';
import { StudentInterceptor } from '../../inteceptors/student.interceptor';

@ApiTags('Estudiantes')
@Controller('student')
export class StudentController {
  constructor(
    private readonly updateStudentInteractor: UpdateStudentInteractor,
  ) {}

  @Put()
  @ApiOperation({ summary: 'Actualizar estudiante' })
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(StudentInterceptor, OwnerInterceptor)
  async update(
    @Body() payload: UpdateStudentRequest,
  ): Promise<{ message: string }> {
    console.log('payload', payload);
    return this.updateStudentInteractor.execute(payload);
  }
}
