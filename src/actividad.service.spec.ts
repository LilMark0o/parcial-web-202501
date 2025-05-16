import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActividadService } from './services/actividad.service';
import { Actividad } from './entities/actividad.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockActividadRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
});

describe('ActividadService', () => {
  let service: ActividadService;
  let repository: Repository<Actividad>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActividadService,
        {
          provide: getRepositoryToken(Actividad),
          useFactory: mockActividadRepository,
        },
      ],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    repository = module.get<Repository<Actividad>>(getRepositoryToken(Actividad));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearActividad', () => {
      it('debería crear una actividad con datos válidos', async () => {
        const actividadDto = {
          titulo: 'ISIS Programacion con tecnolgias Web',
          fecha: '2025-05-20',
          cupoMaximo: 30,
          estado: 0,
        };
        
        const actividadCreada = {
          id: 1,
          ...actividadDto,
        };
      
      jest.spyOn(repository, 'create').mockReturnValue(actividadCreada as any);
      jest.spyOn(repository, 'save').mockResolvedValue(actividadCreada as any);
      
      const result = await service.crearActividad(actividadDto);
      
      expect(repository.create).toHaveBeenCalledWith({
        ...actividadDto,
        estado: 0,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(actividadCreada);
    });

    it('debería rechazar actividad con título muy corto', async () => {
      const actividadDto = {
        titulo: 'lololol',
        fecha: '2025-05-20',
        cupoMaximo: 30,
        estado: 0,
      };
      
      await expect(service.crearActividad(actividadDto)).rejects.toThrow(BadRequestException);
    });

    it('debería rechazar actividad con símbolos en el título', async () => {
      const actividadDto = {
        titulo: 'ISIS PROGRAMACION WEB LALALALA @#$%!', // Contiene símbolos
        fecha: '2025-05-20',
        cupoMaximo: 30,
        estado: 0,
      };
      
      await expect(service.crearActividad(actividadDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('cambiarEstado', () => {
    it('debería cambiar a estado cerrado si el 80% del cupo está lleno', async () => {
      const actividadId = 1;
      const nuevoEstado = { estado: 1 }; 
      
      const actividad = {
        id: actividadId,
        titulo: 'Taller de Programación Web Avanzada',
        fecha: '2025-05-20',
        cupoMaximo: 10,
        estado: 0, 
        inscritos: Array(8).fill({}), 
      };
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(actividad as any);
      jest.spyOn(repository, 'save').mockImplementation((act) => Promise.resolve(act as any));
      
      const result = await service.cambiarEstado(actividadId, nuevoEstado);
      
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result.estado).toBe(1);
    });

    it('debería rechazar cambio a cerrado si menos del 80% del cupo está lleno', async () => {
      const actividadId = 1;
      const nuevoEstado = { estado: 1 }; 
      
      const actividad = {
        id: actividadId,
        titulo: 'Taller de Programación Web Avanzada',
        fecha: '2025-05-20',
        cupoMaximo: 10,
        estado: 0,
        inscritos: Array(7).fill({}), 
      };
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(actividad as any);

      await expect(service.cambiarEstado(actividadId, nuevoEstado)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllActividadesByDate', () => {
    it('debería encontrar actividades por fecha', async () => {
      const fecha = '2025-05-20';
      const actividades = [
        {
          id: 1,
          titulo: 'Taller de Programación Web',
          fecha: fecha,
          cupoMaximo: 30,
          estado: 0,
        },
        {
          id: 2,
          titulo: 'Conferencia de Inteligencia Artificial',
          fecha: fecha,
          cupoMaximo: 100,
          estado: 0,
        },
      ];
      
      jest.spyOn(repository, 'find').mockResolvedValue(actividades as any);
      
      const result = await service.findAllActividadesByDate(fecha);
      
      expect(repository.find).toHaveBeenCalledWith({
        where: { fecha },
        relations: ['inscritos', 'reseñas'],
      });
      expect(result).toEqual(actividades);
      expect(result.length).toBe(2);
    });
  });
});