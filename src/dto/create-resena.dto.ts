import { IsInt, IsString } from 'class-validator';

export class CreateReseñaDto {
  @IsString()
  comentario: string;

  @IsInt()
  calificacion: number;

  @IsString()
  fecha: string;

  @IsInt()
  estudianteId: number;

  @IsInt()
  actividadId: number;
}
