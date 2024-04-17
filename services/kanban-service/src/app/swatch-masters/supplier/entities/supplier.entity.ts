import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('swatch_supplier')
export class SupplierEntity {
  @PrimaryGeneratedColumn('increment', { 
    name: 'supplier_id' 
  })
  supplierId: number;

  @Column('varchar', { name: 'supplier_code', length: 60 })
  supplierCode: string;

  @Column('varchar', { name: 'supplier_name', length: 60 })
  supplierName: string;

  @Column('varchar', { name: 'created_user', nullable: true })
  createdUser: string;

  @Column('varchar', { name: 'updated_user', nullable: true })
  updatedUser: string;

  @Column({
    nullable: false,
    name: 'is_active',
    default: 1,
  })
  isActive: boolean;

  @CreateDateColumn({
    name: "created_at",
    type: "datetime"
})
createdAt: Date;

@CreateDateColumn({
    name: "updated_at",
    type: "datetime"
})
updatedAt: Date;

}
