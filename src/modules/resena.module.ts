import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReseñaController } from '../controllers/resena.controller';
import { ReseñaService } from '../services/resena.service';
import { Reseña } from '../entities/resena.entity';
import { Estudiante } from '../entities/estudiante.entity';
import { Actividad } from '../entities/actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reseña, Estudiante, Actividad])],
  controllers: [ReseñaController],
  providers: [ReseñaService],
  exports: [ReseñaService],
})
export class ReseñaModule {}
