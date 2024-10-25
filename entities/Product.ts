import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Region } from './Region';

@Entity('SANPHAM')
export class Product {
  @PrimaryGeneratedColumn({ type: 'int' })
  MASP: number;

  @Column({ type: 'varchar', length: 40, nullable: true })
  TENSP: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  DVT: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  NUOCSX: string;

  @Column({ type: 'money', nullable: true })
  GIA: number;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'KHU_VUC' })
  region: Region; 

  @Column({ type: 'uniqueidentifier', nullable: true })
  rowguid: string;
}
