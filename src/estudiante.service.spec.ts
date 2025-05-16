import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteService } from './services/estudiante.service';
import { Estudiante } from './entities/estudiante.entity';
import { Actividad } from './entities/actividad.entity';
import { BadRequestException } from '@nestjs/common';

const mockEstudianteRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockActividadRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepository: Repository<Estudiante>;
  let actividadRepository: Repository<Actividad>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
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

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepository = module.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
    actividadRepository = module.get<Repository<Actividad>>(getRepositoryToken(Actividad));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearEstudiante', () => {
    it('debería crear un estudiante con datos válidos', async () => {
      const estudianteDto = {
        cedula: 123456789,
        nombre: 'Marco Ramirez',
        correo: 'marcoalejandroramirezc@gmail.com',
        programa: 'ISIS',
        semestre: 5,
      };
      
      const estudianteCreado = {
        id: 1,
        ...estudianteDto,
      };
      
      jest.spyOn(estudianteRepository, 'create').mockReturnValue(estudianteCreado as any);
      jest.spyOn(estudianteRepository, 'save').mockResolvedValue(estudianteCreado as any);
      
      const result = await service.crearEstudiante(estudianteDto);
      
      expect(estudianteRepository.create).toHaveBeenCalledWith(estudianteDto);
      expect(estudianteRepository.save).toHaveBeenCalled();
      expect(result).toEqual(estudianteCreado);
    });

    it('debería lanzar error cuando el correo es inválido', async () => {
      const estudianteDto = {
        cedula: 123456789,
        nombre: 'Marco Ramirez',
        correo: 'correo-invalido', // Correo inválido
        programa: 'ISIS',
        semestre: 5,
      };
      
      await expect(service.crearEstudiante(estudianteDto)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar error cuando el semestre está fuera de rango', async () => {
      const estudianteDto = {
        cedula: 123456789,
        nombre: 'Marco Ramirez',
        correo: 'marcoalejandroramirezc@gmail.com',
        programa: 'ISIS',
        semestre: 11, // Semestre fuera de rango (1-10)
      };
      
      await expect(service.crearEstudiante(estudianteDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('inscribirseActividad', () => {
    it('debería inscribir a un estudiante en una actividad con éxito', async () => {
      const estudianteId = 1;
      const actividadId = 1;
      
      const estudiante = {
        id: estudianteId,
        nombre: 'Marco Ramirez',
        correo: 'marcoalejandroramirezc@gmail.com',
      };
      
      const actividad = {
        id: actividadId,
        titulo: 'Taller de Programación Web Avanzada',
        fecha: '2025-05-20',
        cupoMaximo: 20,
        estado: 0, 
        inscritos: [],
      };
      
      jest.spyOn(estudianteRepository, 'findOne').mockResolvedValue(estudiante as any);
      jest.spyOn(actividadRepository, 'findOne').mockResolvedValue(actividad as any);
      jest.spyOn(actividadRepository, 'save').mockImplementation((act) => Promise.resolve(act as any));
      
      const result = await service.inscribirseActividad(estudianteId, actividadId);
      
      expect(estudianteRepository.findOne).toHaveBeenCalled();
      expect(actividadRepository.findOne).toHaveBeenCalled();
      expect(actividadRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('mensaje', 'Inscripción exitosa');
    });

    it('debería rechazar la inscripción si la actividad está cerrada', async () => {
      const estudianteId = 1;
      const actividadId = 1;
      
      const estudiante = {
        id: estudianteId,
        nombre: 'Marco Ramirez',
        correo: 'marcoalejandroramirezc@gmail.com',
      };
      
      const actividad = {
        id: actividadId,
        titulo: 'Taller de Programación Web Avanzada',
        fecha: '2025-05-20',
        cupoMaximo: 20,
        estado: 1,
        inscritos: [],
      };
      
      jest.spyOn(estudianteRepository, 'findOne').mockResolvedValue(estudiante as any);
      jest.spyOn(actividadRepository, 'findOne').mockResolvedValue(actividad as any);
      
      await expect(service.inscribirseActividad(estudianteId, actividadId)).rejects.toThrow(BadRequestException);
    });
  });
});