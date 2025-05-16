import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../entities/estudiante.entity';
import { Actividad } from '../entities/actividad.entity';
import { CreateEstudianteDto } from '../dto/create-estudiante.dto';
import { isEmail } from 'class-validator';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Actividad)
    private actividadRepository: Repository<Actividad>,
  ) {}

  async crearEstudiante(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    if (!isEmail(createEstudianteDto.correo)) {
      throw new BadRequestException('¡ESPERE AHI!, está usted infringiendo una RESTRICCION DEL PARCIAL, El correo electrónico no es válido');
    }

    if (createEstudianteDto.semestre < 1 || createEstudianteDto.semestre > 10) {
      throw new BadRequestException('¡ESPERE AHI!, está usted infringiendo una RESTRICCION DEL PARCIAL, El semestre debe estar entre 1 y 10');
    }

    const estudiante = this.estudianteRepository.create(createEstudianteDto);
    return this.estudianteRepository.save(estudiante);
  }

  async findEstudianteById(id: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['actividades', 'reseñas'],
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }

    return estudiante;
  }

  async inscribirseActividad(estudianteId: number, actividadId: number): Promise<any> {
    const estudiante = await this.findEstudianteById(estudianteId);
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['inscritos'],
    });

    if (!actividad) {
      throw new NotFoundException(`¡ESPERE AHI!, está usted infringiendo una RESTRICCION DEL PARCIAL, Actividad con ese ID no encontrada`);
    }

    if (actividad.estado !== 0) {
      throw new BadRequestException('¡ESPERE AHI!, está usted infringiendo una RESTRICCION DEL PARCIAL, La actividad no está abierta para inscripciones, upsi');
    }

    if (actividad.inscritos && actividad.inscritos.length >= actividad.cupoMaximo) {
      throw new BadRequestException('¡ESPERE AHI!, está usted infringiendo una RESTRICCION DEL PARCIAL, La actividad no cuenta con cupos disponibles en este momento :((');
    }

    const yaInscrito = actividad.inscritos.some(est => est.id === estudiante.id);
    if (yaInscrito) {
      throw new BadRequestException('¡ESPERE AHI!, está usted infringiendo una RESTRICCION DEL PARCIAL, El estudiante ya está inscrito en esta actividad');
    }

    if (!actividad.inscritos) {
      actividad.inscritos = [];
    }
    actividad.inscritos.push(estudiante);
    await this.actividadRepository.save(actividad);

    return {
      mensaje: 'Inscripción exitosa'
    };
  }
}