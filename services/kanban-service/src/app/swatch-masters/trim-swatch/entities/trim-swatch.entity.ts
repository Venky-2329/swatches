import { StatusEnum } from "libs/shared-models";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { TrimUploadEntity } from "./trim-swatch-upload-entity";

@Entity('trim_swatch')
export class TrimSwatchEntity {
    @PrimaryGeneratedColumn("increment",{name:'trim_swatch_id'})
    trimSwatchId : number

    @Column('varchar',{name:'trim_swatch_number' , nullable:false , length:50})
    trimSwatchNumber : string

    @Column('int',{name:'buyer_id' , 
     nullable: true
})
    buyerId : number

    @Column('int',{name:'supplier_id'})
    supplierId : number

    @Column('varchar',{
        name:'po_number',
        nullable: true
    })
    poNumber: string

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
        name:'invoice_no',
        nullable: false,
        length:50
    })
    invoiceNo: string

    @Column('varchar',{
        name:'style_no',
        nullable:false,
        length:50
    })
    styleNo: string

    @Column('varchar',{
        name:'grn_number',
        nullable: false
    })
    grnNumber: string

    @Column('date',{
        name:'grn_date',
        // nullable: false
    })
    grnDate: Date

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

    @Column('varchar',{
        name:'created_user_mail',
        nullable:false,
        length:50
    })
    createdUserMail: string | null

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
        length: 255
    })
    rejectionReason: string

    @Column('int',{
        name:'approver_id',
        nullable:false,
    })
    approverId: number

    @Column('varchar',{
        name:'rework_reason',
        length: 255
    })
    reworkReason: string

    @OneToMany(() => TrimUploadEntity , trimUpload => trimUpload.trimInfo , {cascade: true})
    uploadInfo : TrimUploadEntity[]

}
