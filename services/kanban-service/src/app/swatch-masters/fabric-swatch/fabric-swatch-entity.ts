import { StatusEnum } from "libs/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity('fabric_swatch')
export class FabricSwatchEntity{

    @PrimaryGeneratedColumn('increment',{
        name:'fabric_swatch_id'
    })
    fabricSwatchId: number

    @Column('varchar',{
        name:'fabric_swatch_number',
        nullable: false,
        length:50
    })
    fabricSwatchNumber: string

    @Column('int',{
        name:'buyer_id'
    })
    buyerId: number

    @Column('int',{
        name:'brand_id',
        nullable:false
    })
    brandId: number

    @Column('varchar',{
        name:'style_no',
        nullable:false,
        length:50
    })
    styleNo: string

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
        name:'category_type',
        nullable: true,
    })
    categoryType: string

    @Column('int',{
        name:'category_id',
        nullable: true,
    })
    categoryId: number

    @Column('int',{
        name:'season_id',
        nullable: true
    })
    seasonId: number

    @Column('varchar',{
        name:'mill',
        nullable: true
    })
    mill: string

    @Column('varchar',{
        name:'color',
        nullable: false
    })
    color: string

    @Column('varchar',{
        name:'po_number',
        nullable: false
    })
    poNumber: string

    @Column('varchar',{
        name:'grn_number',
        nullable: false
    })
    grnNumber: string
    
    @Column('varchar', {
        nullable: true,
        name: 'file_name',
        length: 250,
    })
    fileName: string;

    @Column('varchar', {
        nullable: true,
        name: 'file_path',
        length: 250,
    })
    filePath: string;

    @Column('enum',{
        name:'status',
        enum: StatusEnum
    })
    status: StatusEnum

    @Column('date',{
        name:'grn_date',
        // nullable: false
    })
    grnDate: Date

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

    @Column('varchar',{
        name:'rejection_reason',
        length:255
    })
    rejectionReason: string

    @Column('int',{
        name:'approver_id',
        nullable:false,
    })
    approverId: number

}