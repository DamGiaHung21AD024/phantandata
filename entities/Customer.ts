import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Region } from './Region';

@Entity('KHACHHANG')
export class Customer {
  @PrimaryGeneratedColumn({ type: 'int' })  
  MAKH: Number;

  @Column({ type: 'varchar', length: 40, nullable: true })
  HOTEN: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  DCHI: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  SODT: string;

  @Column({ type: 'smalldatetime', nullable: true })
  NGSINH: Date;

  @Column({ type: 'smalldatetime', nullable: true })
  NGDK: Date;

  @Column({ type: 'money'})
  DOANHSO: number;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'KHU_VUC' })
  region: Region;

  @Column({ type: 'char', length: 4, nullable: true })
  KHU_VUC: string;

  @Column({ type: 'uniqueidentifier', nullable: true })
  rowguid: string;
}
