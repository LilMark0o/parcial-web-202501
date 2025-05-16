import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ActividadService } from '../services/actividad.service';
import { CreateActividadDto } from '../dto/create-actividad.dto';
import { CambiarEstadoDto } from '../dto/cambiar-estado.dto';

@Controller('actividades')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crearActividad(@Body() createActividadDto: CreateActividadDto) {
    return this.actividadService.crearActividad(createActividadDto);
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() cambiarEstadoDto: CambiarEstadoDto,
  ) {
    return this.actividadService.cambiarEstado(id, cambiarEstadoDto);
  }

  @Get('fecha/:fecha')
  async findAllActividadesByDate(@Param('fecha') fecha: string) {
    return this.actividadService.findAllActividadesByDate(fecha);
  }

  @Get(':id')
  async findActividadById(@Param('id', ParseIntPipe) id: number) {
    return this.actividadService.findActividadById(id);
  }
}