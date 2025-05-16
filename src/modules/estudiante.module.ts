import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteController } from '../controllers/estudiante.controller';
import { EstudianteService } from '../services/estudiante.service';
import { Estudiante } from '../entities/estudiante.entity';
import { Actividad } from '../entities/actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante, Actividad])],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
