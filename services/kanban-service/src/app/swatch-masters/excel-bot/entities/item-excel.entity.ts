import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('item_excel')
export class ItemExcelEntity{
    @PrimaryGeneratedColumn('increment',{
        name:'item_excel_id'
    })
    itemExcelId: number

    @Column('varchar',{
        name:'item_code',
        nullable: true,
        length: 100
    })
    itemCode: string

    @Column('varchar',{
        name:'item_description',
        nullable: true,
        length: 100
    })
    itemDescription: string

    @Column('varchar',{
        name:'sales_person',
        nullable: true,
        length: 100
    })
    salesPerson: string

    @Column('varchar',{
        name:'m3_item_responsible',
        nullable: true,
        length: 100
    })
    m3ItemRes: string

    @Column('varchar',{
        name:'crm_item_responsible',
        nullable: true,
        length: 100
    })
    crmItemRes: string

    @Column('varchar',{
        name:'co_approver',
        nullable: true,
        length: 100
    })
    coApprover: string

    @Column('varchar',{
        name:'prod_merchant',
        nullable: true,
        length: 100
    })
    prodMerchant: string

    @Column('varchar',{
        name:'pd_merchant',
        nullable: true,
        length: 100
    })
    pdMerchant: string

    @Column('varchar',{
        name:'last_modified_by',
        nullable: true,
        length: 100
    })
    lastModifiedBy: string

    @Column('varchar',{
        name:'brand',
        nullable: true,
        length: 100
    })
    brand: string

    @Column('varchar',{
        name:'buyer_code',
        nullable: true,
    })
    buyerCode: string

    @Column('varchar',{
        name:'buyer_name',
        nullable: true,
    })
    buyerName: string

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