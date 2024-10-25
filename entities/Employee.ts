import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Region } from './Region';

@Entity('NHANVIEN')
export class Employee {
  @PrimaryGeneratedColumn({ type: 'int' }) 
  MANV: number;

  @Column({ type: 'varchar', length: 40, nullable: true })
  HOTEN: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  SODT: string;

  @Column({ type: 'smalldatetime', nullable: true })
  NGVL: Date;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'KHU_VUC' })
  region: Region; 

  @Column({ type: 'uniqueidentifier', nullable: true })
  rowguid: string;
}
