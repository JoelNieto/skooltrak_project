import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DegreeService } from './degree.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';

@ApiTags('Degree')
@Controller('degree')
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Post()
  create(@Body() createDegreeDto: CreateDegreeDto) {
    return this.degreeService.create(createDegreeDto);
  }

  @Get()
  findAll() {
    return this.degreeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.degreeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDegreeDto: UpdateDegreeDto) {
    return this.degreeService.update(id, updateDegreeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.degreeService.remove(id);
  }
}
