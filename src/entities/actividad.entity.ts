
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Reseña } from './resena.entity';

@Entity()
export class Actividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  fecha: string;

  @Column()
  cupoMaximo: number;

  @Column({ default: 0 })
  estado: number;

  @ManyToMany(() => Estudiante, estudiante => estudiante.actividades)
  inscritos: Estudiante[];

  @OneToMany(() => Reseña, reseña => reseña.actividad)
  reseñas: Reseña[];
}