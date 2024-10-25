import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './Invoice';
import { Product } from './Product';

@Entity('CTHD')
export class InvoiceDetail {
  @PrimaryColumn()
  SOHD: number;

  @PrimaryColumn({ type: 'int' })
  MASP: number;

  @Column({ type: 'int' })
  SL: number;

  @ManyToOne(() => Invoice, invoice => invoice.invoiceDetails) 
  @JoinColumn({ name: 'SOHD' })
  invoice: Invoice;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'MASP' })
  product: Product;

  @Column({ type: 'uniqueidentifier', nullable: true })
  rowguid: string;
}
