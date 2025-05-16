import { IsInt, IsString } from 'class-validator';

export class CreateActividadDto {
  @IsString()
  titulo: string;

  @IsString()
  fecha: string;

  @IsInt()
  cupoMaximo: number;
}
