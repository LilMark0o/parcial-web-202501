import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReseñaService } from './services/resena.service';
import { Reseña } from './entities/resena.entity';
import { Estudiante } from './entities/estudiante.entity';
import { Actividad } from './entities/actividad.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockReseñaRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockEstudianteRepository = () => ({
  findOne: jest.fn(),
});

const mockActividadRepository = () => ({
  findOne: jest.fn(),
});

describe('ReseñaService', () => {
  let service: ReseñaService;
  let reseñaRepository: Repository<Reseña>;
  let estudianteRepository: Repository<Estudiante>;
  let actividadRepository: Repository<Actividad>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReseñaService,
        {
          provide: getRepositoryToken(Reseña),
          useFactory: mockReseñaRepository,
        },
        {
          provide: getRepositoryToken(Estudiante),
          useFactory: mockEstudianteRepository,
        },
        {
          provide: getRepositoryToken(Actividad),
          useFactory: mockActividadRepository,
        },
      ],
    }).compile();

    service = module.get<ReseñaService>(ReseñaService);
    reseñaRepository = module.get<Repository<Reseña>>(getRepositoryToken(Reseña));
    estudianteRepository = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
    actividadRepository = module.get<Repository<Actividad>>(getRepositoryToken(Actividad));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('agregarReseña', () => {
    it('debería agregar una reseña cuando el estudiante participó y la actividad está finalizada', async () => {
      const reseñaDto = {
        comentario: 'Excelente taller, muy informativo',
        calificacion: 5,
        fecha: '2025-05-25',
        estudianteId: 1,
        actividadId: 1,
      };
      
      const estudiante = {
        id: 1,
        nombre: 'Marco Ramirez',
        actividades: [],
      };
      
      const actividad = {
        id: 1,
        titulo: 'Taller de Programación Web Avanzada',
        estado: 2,  
        inscritos: [{ id: 1 }], 
      };
      
      const reseñaCreada = {
        id: 1,
        ...reseñaDto,
        estudiante,
        actividad,
      };
      
      jest.spyOn(estudianteRepository, 'findOne').mockResolvedValue(estudiante as any);
      jest.spyOn(actividadRepository, 'findOne').mockResolvedValue(actividad as any);
      jest.spyOn(reseñaRepository, 'create').mockReturnValue(reseñaCreada as any);
      jest.spyOn(reseñaRepository, 'save').mockResolvedValue(reseñaCreada as any);
      
      const result = await service.agregarReseña(reseñaDto);
      
      expect(estudianteRepository.findOne).toHaveBeenCalled();
      expect(actividadRepository.findOne).toHaveBeenCalled();
      expect(reseñaRepository.create).toHaveBeenCalled();
      expect(reseñaRepository.save).toHaveBeenCalled();
      expect(result).toEqual(reseñaCreada);
    });

    it('debería rechazar la reseña si la actividad no está finalizada', async () => {
      const reseñaDto = {
        comentario: 'Excelente taller, muy informativo',
        calificacion: 5,
        fecha: '2025-05-25',
        estudianteId: 1,
        actividadId: 1,
      };
      
      const estudiante = {
        id: 1,
        nombre: 'Marco Ramirez',
        actividades: [],
      };
      
      const actividad = {
        id: 1,
        titulo: 'Taller de Programación Web Avanzada',
        estado: 1, 
        inscritos: [{ id: 1 }], 
      };
      
      jest.spyOn(estudianteRepository, 'findOne').mockResolvedValue(estudiante as any);
      jest.spyOn(actividadRepository, 'findOne').mockResolvedValue(actividad as any);
      
      await expect(service.agregarReseña(reseñaDto)).rejects.toThrow(BadRequestException);
    });

    it('debería rechazar la reseña si el estudiante no estuvo inscrito', async () => {
      const reseñaDto = {
        comentario: 'Excelente taller, muy informativo',
        calificacion: 5,
        fecha: '2025-05-25',
        estudianteId: 1,
        actividadId: 1,
      };
      
      const estudiante = {
        id: 1,
        nombre: 'Marco Ramirez',
        actividades: [],
      };
      
      const actividad = {
        id: 1,
        titulo: 'Taller de Programación Web Avanzada',
        estado: 2, 
        inscritos: [{ id: 2 }], 
      };
      
      jest.spyOn(estudianteRepository, 'findOne').mockResolvedValue(estudiante as any);
      jest.spyOn(actividadRepository, 'findOne').mockResolvedValue(actividad as any);
      
      await expect(service.agregarReseña(reseñaDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findClaseById', () => {
    it('debería encontrar la reseña por ID', async () => {
      const reseñaId = 1;
      const reseña = {
        id: reseñaId,
        comentario: 'Excelente taller',
        calificacion: 5,
        fecha: '2025-05-25',
        estudiante: { id: 1, nombre: 'Marco Ramirez' },
        actividad: { id: 1, titulo: 'Taller de Programación' },
      };
      
      jest.spyOn(reseñaRepository, 'findOne').mockResolvedValue(reseña as any);
      
      const result = await service.findClaseById(reseñaId);
      
      expect(reseñaRepository.findOne).toHaveBeenCalledWith({
        where: { id: reseñaId },
        relations: ['estudiante', 'actividad'],
      });
      expect(result).toEqual(reseña);
    });

    it('debería lanzar error si la reseña no existe', async () => {
      const reseñaId = 999;
      
      jest.spyOn(reseñaRepository, 'findOne').mockResolvedValue(null);
      
      await expect(service.findClaseById(reseñaId)).rejects.toThrow(NotFoundException);
    });
  });
});