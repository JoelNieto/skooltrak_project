import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject) private subjects: Repository<Subject>
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    return await this.subjects.save(createSubjectDto);
  }

  findAll() {
    return this.subjects.find();
  }

  findOne(_id: string) {
    return this.subjects.findBy({ _id });
  }

  async update(_id: string, updateSubjectDto: UpdateSubjectDto) {
    return await this.subjects.save({ _id, ...updateSubjectDto });
  }

  async remove(_id: string) {
    await this.subjects.delete({ _id });
  }
}
