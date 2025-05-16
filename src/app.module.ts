// Esto lo saqué del proyecto para usar posgres

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EstudianteModule } from './modules/estudiante.module';
import { ActividadModule } from './modules/actividad.module';
import { ReseñaModule } from './modules/resena.module';
import { Estudiante } from './entities/estudiante.entity';
import { Actividad } from './entities/actividad.entity';
import { Reseña } from './entities/resena.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_DATABASE', 'parcial'),
        entities: [Estudiante, Actividad, Reseña],
        synchronize: true,
      }),
    }),

    EstudianteModule,
    ActividadModule,
    ReseñaModule,
  ],
})
export class AppModule {}