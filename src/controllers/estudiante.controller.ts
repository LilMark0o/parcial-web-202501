import { Controller, Post, Param, Body, UseGuards, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { EstudianteService } from '../services/estudiante.service';
import { InscribirseActividadDto } from '../dto/inscribirse-actividad.dto';

@Controller('estudiantes')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post(':id/actividades')
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