import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { LevelsService } from './levels.service';

@Controller('levels')
@ApiTags('Levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post()
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelsService.create(createLevelDto);
  }

  @Get()
  findAll() {
    return this.levelsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelsService.update(id, updateLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelsService.remove(id);
  }
}
