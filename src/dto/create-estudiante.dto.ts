import { IsInt, IsString } from 'class-validator';

export class CreateEstudianteDto {
  @IsInt()
  cedula: number;

  @IsString()
  nombre: string;

  @IsString()
  correo: string;

  @IsString()
  programa: string;

  @IsInt()
  semestre: number;
}