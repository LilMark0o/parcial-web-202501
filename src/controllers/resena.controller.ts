import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ReseñaService } from '../services/resena.service';
import { CreateReseñaDto } from '../dto/create-resena.dto';

@Controller('resenas')
export class ReseñaController {
  constructor(private readonly reseñaService: ReseñaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async agregarReseña(@Body() createReseñaDto: CreateReseñaDto) {
    return this.reseñaService.agregarReseña(createReseñaDto);
  }

  @Get(':id')
  async findClaseById(@Param('id', ParseIntPipe) id: number) {
    return this.reseñaService.findClaseById(id);
  }
}