import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadController } from '../controllers/actividad.controller';
import { ActividadService } from '../services/actividad.service';
import { Actividad } from '../entities/actividad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actividad])],
  controllers: [ActividadController],
  providers: [ActividadService],
  exports: [ActividadService],
})
export class ActividadModule {}
