import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School } from './entities/school.entity';

@Injectable()
export class SchoolsService {
  constructor(@InjectRepository(School) private schools: Repository<School>) {}
  async create(createSchoolDto: CreateSchoolDto) {
    return await this.schools.save(createSchoolDto);
  }

  findAll() {
    return this.schools.find();
  }

  findOne(_id: string) {
    return this.schools.findOneBy({ _id });
  }

  async update(_id: string, updateSchoolDto: UpdateSchoolDto) {
    return await this.schools.save({ _id, ...updateSchoolDto });
  }

  async remove(_id: string) {
    await this.schools.delete({ _id });
  }
}
