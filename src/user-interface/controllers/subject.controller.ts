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
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FindSubjectsInteractor } from '../../application-core/subject/use-cases/findSubjects.interactor';
import { Public } from '../../application-core/abstract/auth/decorator/public.decorator';
import { FindSubjectBySkuInteractor } from '../../application-core/subject/use-cases/findSubjectBySku.interactor';
import {
  Subject,
  SubjectDocument,
} from '../../infrastructure/persistence/schema/subject.schema';
import {
  CreateSubjectRequest,
  SubjectResponse,
  UpdateSubjectRequest,
} from '../../application-core/subject/dto/subject.dto';
import { CreateSubjectInteractor } from '../../application-core/subject/use-cases/createSubject.interactor';
import { UpdateSubjectBySkuInteractor } from '../../application-core/subject/use-cases/updateSubjectBySku.interactor';
import { UpdateWriteOpResult } from 'mongoose';
import { DeleteSubjectBySkuInteractor } from '../../application-core/subject/use-cases/deleteSubjectBySku.interactor';

@ApiTags('Materias')
@Controller('subjects')
export class SubjectController {
  constructor(
    private readonly findSubjectsInteractor: FindSubjectsInteractor,
    private readonly findSubjectBySkuInteractor: FindSubjectBySkuInteractor,
    private readonly createSubjectInteractor: CreateSubjectInteractor,
    private readonly updateSubjectBySkuInteractor: UpdateSubjectBySkuInteractor,
    private readonly deleteSubjectBySkuInteractor: DeleteSubjectBySkuInteractor,
  ) {}

  @Get('/')
  @Public()
  @ApiOperation({ summary: 'Listar y filtrar todas las materias' })
  @ApiOkResponse({
    type: SubjectResponse,
    isArray: true,
  })
  @ApiQuery({ name: 'filter', required: false, example: '{}' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'skip', required: false, example: 0 })
  @ApiQuery({ name: 'sort', required: false, example: 'asc' })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  async find(
    @Query('filter') filter: string,
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('sortBy') sortBy: string = 'createdAt',
  ): Promise<SubjectDocument[]> {
    return this.findSubjectsInteractor.execute(
      JSON.parse(filter || '{}'),
      {},
      {
        limit,
        skip,
        sort: { [sortBy]: sort },
      },
    );
  }

  @Get(':sku')
  @Public()
  @ApiOperation({ summary: 'Obtener una materia por su código' })
  @ApiOkResponse({
    type: SubjectResponse,
  })
  @ApiNotFoundResponse({ description: 'Materia no encontrada' })
  @ApiParam({ name: 'sku', required: true, example: '20252' })
  async findBySku(@Param('sku') sku: string): Promise<SubjectDocument> {
    return this.findSubjectBySkuInteractor.execute(sku);
  }

  @Post('/')
  @ApiOperation({ summary: 'Crear una materia' })
  @ApiCreatedResponse({
    type: SubjectResponse,
  })
  async create(
    @Body() payload: CreateSubjectRequest,
  ): Promise<SubjectDocument> {
    return this.createSubjectInteractor.execute(payload);
  }

  @Put(':sku')
  @ApiOperation({ summary: 'Actualizar una materia por su código' })
  @ApiNotFoundResponse({ description: 'Materia no encontrada' })
  @ApiParam({ name: 'sku', required: true, example: '20252' })
  async updateBySku(
    @Param('sku') sku: string,
    @Body() payload: UpdateSubjectRequest,
  ): Promise<UpdateWriteOpResult> {
    return this.updateSubjectBySkuInteractor.execute(sku, payload);
  }

  @Delete(':sku')
  @ApiOperation({ summary: 'Eliminar una materia por su código' })
  @ApiNotFoundResponse({ description: 'Materia no encontrada' })
  @ApiParam({ name: 'sku', required: true, example: '20252' })
  async deleteBySku(@Param('sku') sku: string) {
    return this.deleteSubjectBySkuInteractor.execute(sku);
  }
}
