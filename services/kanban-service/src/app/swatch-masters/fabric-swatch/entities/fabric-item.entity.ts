import { ReworkStatus, StatusEnum } from "libs/shared-models";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { FabricUploadEntity } from "./fabric-swatch-upload-entity";
import { FabricSwatchEntity } from "./fabric-swatch-entity";

@Entity('fabric_items')
export class FabricItemEntity{

    @PrimaryGeneratedColumn('increment',{
        name:'fabric_item_id'
    })
    fabricItemId: number

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

    @ManyToOne(()=>FabricSwatchEntity, fabEntity=>fabEntity.uploadInfo,{nullable: false})
    @JoinColumn({name:'fabric_swatch_id'})
    fabInfo: FabricSwatchEntity

}