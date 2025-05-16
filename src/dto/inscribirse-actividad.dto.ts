import { IsInt } from 'class-validator';

export class InscribirseActividadDto {
  @IsInt()
  actividadId: number;
}