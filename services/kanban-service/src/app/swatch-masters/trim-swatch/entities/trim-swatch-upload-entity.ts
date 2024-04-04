import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TrimSwatchEntity } from "./trim-swatch.entity";

@Entity('trim_upload_entity')
export class TrimUploadEntity{
    @PrimaryGeneratedColumn('increment',{
        name: 'upload_id'
    })
    uploadId :number

    @Column('varchar',{
        nullable : true,
        name: 'file_name',
        length: '250'
    })
    fileName : string

    @Column('varchar',{
        nullable : true,
        name: 'file_path',
        length: '250'
    })
    filePath : string

    @Column('varchar',{
        nullable : true,
        name: 'created_name',
        length: '50'
    })
    createdUser : string | null

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: string;

    @ManyToOne(() => TrimSwatchEntity, trimEntity => trimEntity.uploadInfo , {nullable: false})
    @JoinColumn({name:'trim_swatch_id'})
    trimInfo : TrimSwatchEntity
}