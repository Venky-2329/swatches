import { ReworkStatus, StatusEnum } from "libs/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { TrimSwatchEntity } from "./trim-swatch.entity";
@Entity('trim_items')
export class TrimItemEntity{

    @PrimaryGeneratedColumn('increment',{
        name:'trim_item_id'
    })
    trimItemId: number

    @Column('varchar',{
        name:'item_no',
        nullable: false,
        length:50
    })
    itemNo: string

    @Column('varchar',{
        name:'item_description',
        nullable: false,
        length:50
    })
    itemDescription: string

    @Column('varchar',{
        name:'po_no',
        nullable: false,
        length:50
    })
    poNo: string

    @Column('varchar',{
        name:'grn_no',
        nullable: false,
        length:50
    })
    grnNo: string

    @Column('date',{
        name:'grn_date',
        // nullable: false
    })
    grnDate: Date

    @Column('varchar',{
        name:'material_',
        nullable: false,
        length:50
    })
    materialCode: string

    @Column('varchar',{
        name:'material_description',
        nullable: false,
        length:50
    })
    materialDescription: string

    @Column('int',{
        name:'supplier_id',
        nullable: false,
    })
    supplierId: number

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

    @UpdateDateColumn({
        name:'updated_at',
        type:'datetime'
    })
    updatedAt: Date

    @Column('varchar',{
        name:'updated_user',
        nullable:true,
        length:50
    })
    updatedUser: string | null

    @VersionColumn({
        default:1,
        name:'version_flag'
    })
    versionFlag: number

    @ManyToOne(()=>TrimSwatchEntity, trimEntity=>trimEntity.trimInfo,{nullable: false})
    @JoinColumn({name:'fabric_swatch_id'})
    trimInfo: TrimSwatchEntity

}