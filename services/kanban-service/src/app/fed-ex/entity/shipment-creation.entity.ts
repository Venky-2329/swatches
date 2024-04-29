import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('dxm_shipment_creation')
export class DxmShipmentCreation{

    @PrimaryGeneratedColumn('increment', {
        name: 'id',
      })
      id: number;

      @Column('varchar', {
        nullable: true,
        name: 'req_no',
      })
      reqNo: string;

      @Column('varchar', {
        nullable: true,
        name: 'dxm_order_no',
      })
      dxmOrderNo: string;

      @Column('varchar', {
        nullable: true,
        name: 'inv_no',
      })
      invNo: string;

      @Column('varchar', {
        nullable: true,
        name: 'dxm_internal_no',
      })
      dxmInternalNo: string;

      @Column('varchar', {
        nullable: true,
        name: 'dxm_date',
      })
      dxmDate: string;

      @Column('varchar', {
        nullable: true,
        name: 'awb_no',
      })
      awbNo: string;

    @CreateDateColumn({
        name: 'created_date',
      })
      createdDate: string;
    
      @Column('varchar', {
        nullable: true,
        length: 40,
        name: 'created_user',
      })
      createdUser: string | null;
    
      @UpdateDateColumn({
        name: 'updated_date',
      })
      updatedDate: string;
    
      @Column('varchar', {
        nullable: true,
        length: 40,
        name: 'updated_user',
      })
      updatedUser: string | null;
}