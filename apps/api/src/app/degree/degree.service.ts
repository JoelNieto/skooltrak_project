import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { Degree } from './entities/degree.entity';

@Injectable()
export class DegreeService {
  constructor(@InjectRepository(Degree) private degrees: Repository<Degree>) {}
  async create(createDegreeDto: CreateDegreeDto) {
    return await this.degrees.save(createDegreeDto);
  }

  findAll() {
    return this.degrees.find();
  }

  findOne(_id: string) {
    return this.degrees.findOneBy({ _id });
  }

  async update(_id: string, updateDegreeDto: UpdateDegreeDto) {
    return await this.degrees.save({ _id, ...updateDegreeDto });
  }

  async remove(_id: string) {
    await this.degrees.delete({ _id });
  }
}
