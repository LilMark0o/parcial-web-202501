import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from '../entities/actividad.entity';
import { CreateActividadDto } from '../dto/create-actividad.dto';
import { CambiarEstadoDto } from '../dto/cambiar-estado.dto';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad)
    private actividadRepository: Repository<Actividad>,
  ) {}

  async crearActividad(createActividadDto: CreateActividadDto): Promise<Actividad> {
    // Validar longitud mínima del título
    if (createActividadDto.titulo.length < 15) {
      throw new BadRequestException('El título debe tener al menos 15 caracteres');
    }

    // Validar que el título no contenga símbolos (solo letras, números y espacios)
    const tituloRegex = /^[a-zA-Z0-9\s]+$/;
    if (!tituloRegex.test(createActividadDto.titulo)) {
      throw new BadRequestException('El título no puede contener símbolos');
    }

    // Crear actividad con estado 0 (abierta) por defecto
    const actividad = this.actividadRepository.create({
      ...createActividadDto,
      estado: 0,
    });

    return this.actividadRepository.save(actividad);
  }

  async cambiarEstado(actividadId: number, cambiarEstadoDto: CambiarEstadoDto): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['inscritos'],
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${actividadId} no encontrada`);
    }

    const nuevoEstado = cambiarEstadoDto.estado;
    const inscritosCount = actividad.inscritos ? actividad.inscritos.length : 0;
    const porcentajeOcupacion = (inscritosCount / actividad.cupoMaximo) * 100;

    // Validación para pasar a estado 1 (cerrada)
    if (nuevoEstado === 1 && porcentajeOcupacion < 80) {
      throw new BadRequestException('La actividad solo puede ser cerrada si el 80% del cupo está lleno');
    }

    // Validación para pasar a estado 2 (finalizada)
    if (nuevoEstado === 2 && inscritosCount < actividad.cupoMaximo) {
      throw new BadRequestException('La actividad solo puede ser finalizada si no hay cupo disponible');
    }

    actividad.estado = nuevoEstado;
    return this.actividadRepository.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<Actividad[]> {
    return this.actividadRepository.find({
      where: { fecha },
      relations: ['inscritos', 'reseñas'],
    });
  }

  async findActividadById(id: number): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({
      where: { id },
      relations: ['inscritos', 'reseñas'],
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    return actividad;
  }
}