import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { FabricSwatchEntity } from "./fabric-swatch-entity";

@Entity('fabric_upload_entity')
export class FabricUploadEntity{
    @PrimaryGeneratedColumn('increment',{
        name:'upload_id'
    })
    uploadId:number

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

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: string;

    @ManyToOne(()=>FabricSwatchEntity, fabEntity=>fabEntity.uploadInfo,{nullable: false})
    @JoinColumn({name:'fabric_swatch_id'})
    fabInfo: FabricSwatchEntity

}