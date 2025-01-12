import {
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionFields,
  QueryOptions,
  UpdateWriteOpResult,
} from 'mongoose';

export class IGateway<T, D> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: D | D[]): Promise<T> {
    return await this.model.create(data);
  }

  async find(
    payload: FilterQuery<T>,
    projection?: ProjectionFields<T>,
    options?: QueryOptions,
  ): Promise<T[]> {
    return this.model.find(payload, projection, options);
  }

  async findOne(
    payload?: FilterQuery<T>,
    projection?: ProjectionFields<T>,
    options?: QueryOptions,
  ): Promise<T> {
    return this.model.findOne(payload, projection, options);
  }

  async findById(
    id: string,
    projection?: ProjectionFields<T>,
    options?: QueryOptions,
  ): Promise<T> {
    return this.model.findById(id, projection, options);
  }

  async updateById(id: string, data: Partial<T>) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T> {
    return this.model.findByIdAndDelete(id);
  }

  async countDocuments(payload: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(payload);
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: Partial<T>,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filter, update);
  }

  async updateMany(
    filter: FilterQuery<T>,
    update: Partial<T>,
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateMany(filter, update);
  }

  async deleteOne(filter: FilterQuery<T>) {
    return this.model.deleteOne(filter);
  }

  async deleteMany(filter: FilterQuery<T>) {
    return this.model.deleteMany(filter);
  }

  async aggregate(pipeline: PipelineStage[]): Promise<any> {
    return this.model.aggregate(pipeline);
  }

  async count(payload: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(payload);
  }
}
