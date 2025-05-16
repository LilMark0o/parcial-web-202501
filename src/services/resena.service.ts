import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reseña } from '../entities/resena.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { Actividad } from '../entities/actividad.entity';
import { CreateReseñaDto } from '../dto/create-resena.dto';

@Injectable()
export class ReseñaService {
  constructor(
    @InjectRepository(Reseña)
    private reseñaRepository: Repository<Reseña>,
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Actividad)
    private actividadRepository: Repository<Actividad>,
  ) {}

  async agregarReseña(createReseñaDto: CreateReseñaDto): Promise<Reseña> {
    const { estudianteId, actividadId } = createReseñaDto;

    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId },
      relations: ['actividades'],
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ese ID no encontrado`);
    }

    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['inscritos'],
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ese ID no encontrada`);
    }

    if (actividad.estado !== 2) {
      throw new BadRequestException('Solo se pueden agregar reseñas a actividades finalizadas');
    }

    const estuvoInscrito = actividad.inscritos.some(est => est.id === estudiante.id);
    if (!estuvoInscrito) {
      throw new BadRequestException('El estudiante no estuvo inscrito en esta actividad, como vas a opinar bro');
    }

    const reseña = this.reseñaRepository.create({
      comentario: createReseñaDto.comentario,
      calificacion: createReseñaDto.calificacion,
      fecha: createReseñaDto.fecha,
      estudiante,
      actividad,
    });

    return this.reseñaRepository.save(reseña);
  }

  async findClaseById(id: number): Promise<Reseña> {
    const reseña = await this.reseñaRepository.findOne({
      where: { id },
      relations: ['estudiante', 'actividad'],
    });

    if (!reseña) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }

    return reseña;
  }
}