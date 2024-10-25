import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from './Customer';
import { Employee } from './Employee';
import { Region } from './Region';
import { InvoiceDetail } from './InvoiceDetail';

@Entity('HOADON')
export class Invoice {
  @PrimaryGeneratedColumn({ type: 'int' })
  SOHD: number;

  @Column({ type: 'smalldatetime', nullable: true })
  NGHD: Date;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'MAKH' })
  customer: Customer;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'MANV' })
  employee: Employee;

  @Column({ type: 'money', nullable: true })
  TRIGIA: number;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'KHU_VUC' })
  region: Region;
  
  @OneToMany(() => InvoiceDetail, invoiceDetail => invoiceDetail.invoice) 
  invoiceDetails: InvoiceDetail[];

  @Column({ type: 'uniqueidentifier', nullable: true })
  rowguid: string;
}
