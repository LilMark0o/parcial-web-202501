import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Actividad } from './actividad.entity';
import { Reseña } from './resena.entity';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  programa: string;

  @Column()
  semestre: number;

  @ManyToMany(() => Actividad, actividad => actividad.inscritos)
  @JoinTable()
  actividades: Actividad[];

  @OneToMany(() => Reseña, reseña => reseña.estudiante)
  reseñas: Reseña[];
}
