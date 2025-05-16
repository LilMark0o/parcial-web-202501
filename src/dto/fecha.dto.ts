import { IsString } from 'class-validator';

export class CambiarEstadoDto {
  @IsString()
  fecha: string;
}
