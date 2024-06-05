import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('item-excel')
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
        name:'approver',
        nullable: true,
        length: 100
    })
    approver: string

    @Column('varchar',{
        name:'buyer_name',
        nullable: true,
        length: 100
    })
    buyerName: string

    @Column('varchar',{
        name:'buyer_code',
        nullable: true,
        length: 100
    })
    buyerCode: string

    @Column('varchar',{
        name:'brand',
        nullable: true,
        length: 100
    })
    brand: string

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