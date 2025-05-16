import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Actividad } from './actividad.entity';

@Entity()
export class Reseña {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comentario: string;

  @Column()
  calificacion: number;

  @Column()
  fecha: string;

  @ManyToOne(() => Estudiante, estudiante => estudiante.reseñas)
  estudiante: Estudiante;

  @ManyToOne(() => Actividad, actividad => actividad.reseñas)
  actividad: Actividad;
}