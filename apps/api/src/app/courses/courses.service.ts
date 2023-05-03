import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(@InjectRepository(Course) private courses: Repository<Course>) {}

  create(createCourseDto: CreateCourseDto) {
    return this.courses.save(createCourseDto);
  }

  findAll() {
    return this.courses.find();
  }

  findOne(_id: string) {
    return this.courses.findOneBy({ _id });
  }

  async update(_id: string, updateCourseDto: UpdateCourseDto) {
    return await this.courses.save({ _id, ...updateCourseDto });
  }

  async remove(_id: string) {
    await this.courses.delete({ _id });
  }
}
