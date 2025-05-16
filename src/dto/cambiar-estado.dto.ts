import { IsInt } from 'class-validator';

export class CambiarEstadoDto {
  @IsInt()
  estado: number;
}
