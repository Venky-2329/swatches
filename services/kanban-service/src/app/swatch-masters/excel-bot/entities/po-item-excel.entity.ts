import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('po_item_excel')
export class POItemExcelEntity{
    @PrimaryGeneratedColumn('increment',{
        name:'id'
    })
    id: number

    @Column('varchar',{
        name:'item_no'
    })
    itemNo: string

    @Column('varchar',{
        name:'item_name'
    })
    itemName: string

    @Column('varchar',{
        name:'fabric_code'
    })
    fabricCode: string

    @Column('varchar',{
        name:'sector_name'
    })
    sectorName: string

    @Column('varchar',{
        name:'po_no'
    })
    poNo: string

    @Column('varchar',{
        name:'supplier_name'
    })
    supplierName: string

    @Column('varchar',{
        name:'supplier_state'
    })
    supplierState: string

    @Column('varchar',{
        name:'delivery_state'
    })
    deliveryState: string

    @Column('varchar',{
        name:'grn_no'
    })
    grnNo: string

    @Column('varchar',{
        name:'grn_qty'
    })
    grnQty: string

    @Column('varchar',{
        name:'invoice_no'
    })
    invoiceNoDate: string

    @Column('date',{
        name:'m3_grn_receive_date'
    })
    m3GrnReceiveDate: any

    @Column('date',{
        name:'inspection_date'
    })
    inspectionDate: any

    @Column('int',{
        name:'inspection_days'
    })
    inspectionDays: number

    @Column('date',{
        name: 'put_away_date'
    })
    putAwayDate: any

    @Column('int',{
        name: 'pu_away_days'
    })
    putAwayDays: number

    @Column('varchar',{
        name: 'garment_item_res'
    })
    garmentItemRes: string

    @Column('varchar',{
        name: 'buyer'
    })
    buyer: string

    @Column('varchar',{
        name: 'transport_mode'
    })
    transportMode: string
    
    @CreateDateColumn({
        name:'created_at',
        type:'datetime'
    })
    createdAt: Date

    @Column('varchar',{
        name:'created_user',
        nullable:true,
        length:50
    })
    createdUser: string | null
}