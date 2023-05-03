import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';

@Injectable()
export class LevelsService {
  constructor(@InjectRepository(Level) private levels: Repository<Level>) {}
  async create(createLevelDto: CreateLevelDto) {
    return await this.levels.save(createLevelDto);
  }

  findAll() {
    return this.levels.find();
  }

  async update(_id: string, updateLevelDto: UpdateLevelDto) {
    return await this.levels.save({ _id, ...updateLevelDto });
  }

  async remove(_id: string) {
    await this.levels.delete(_id);
  }
}
