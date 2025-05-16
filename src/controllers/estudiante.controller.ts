import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { EstudianteService } from '../services/estudiante.service';
import { CreateEstudianteDto } from '../dto/create-estudiante.dto';
import { InscribirseActividadDto } from '../dto/inscribirse-actividad.dto';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crearEstudiante(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudianteService.crearEstudiante(createEstudianteDto);
  }

  @Get(':id')
  async findEstudianteById(@Param('id', ParseIntPipe) id: number) {
    return this.estudianteService.findEstudianteById(id);
  }

  @Post(':id/actividades')
  @HttpCode(HttpStatus.OK)
  async inscribirseActividad(
    @Param('id', ParseIntPipe) estudianteId: number,
    @Body() inscribirseActividadDto: InscribirseActividadDto,
  ) {
    return this.estudianteService.inscribirseActividad(
      estudianteId, 
      inscribirseActividadDto.actividadId
    );
  }
}