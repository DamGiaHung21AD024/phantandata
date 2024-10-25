import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Customer } from './Customer';
import { Employee } from './Employee';
import { Product } from './Product';

@Entity('KHU_VUC')
export class Region {
  @PrimaryColumn({ type: 'char', length: 4 })
  MA_KV: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  TEN_KV: string;

  @OneToMany(() => Customer, customer => customer.region)
  customers: Customer[];

  @OneToMany(() => Employee, employee => employee.region)
  employees: Employee[];

  @OneToMany(() => Product, product => product.region) 
  products: Product[];

  @Column({ type: 'uniqueidentifier', nullable: true })
  rowguid: string;
}
