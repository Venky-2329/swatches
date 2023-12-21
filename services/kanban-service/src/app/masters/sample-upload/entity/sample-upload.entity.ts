import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommonFields } from "../../racks/entity/common.entity";

@Entity('sample_upload')
export class SampleUpload extends CommonFields{
    @PrimaryGeneratedColumn('increment', {
        name: 'sample_id',
    })
    sampleId: number;

    @Column('int',{
        nullable:false,
        name:"brand_id"
    })
    brandId:number

    @Column('varchar', {
        nullable: false,
        name: "style_no",
        length: 250
    })
    styleNo: string;

    @Column('varchar', {
        nullable: false,
        name: "item_no",
        length: 250
    })
    itemNo: string;

    @Column('varchar', {
        nullable: false,
        name: "item_description",
        length: 250
    })
    itemDescription: string;

    @Column('int',{
        nullable:false,
        name:"category_id"
    })
    categoryId:number

    @Column('int',{
        nullable:false,
        name:"season_id"
    })
    seasonId:number

    @Column('varchar', {
        nullable: false,
        name: "fabric_content",
        length: 250
    })
    fabricContent: string;

    @Column('varchar', {
        nullable: false,
        name: "fabric_count",
        length: 250
    })
    fabricCount: string;

    @Column('int', {
        nullable: false,
        name: "Quantity",
    })
    quantity: number;

    @Column('varchar', {
        nullable: false,
        name: "gsm",
        length: 250
    })
    gsm: string;

    @Column('varchar', {
        nullable: false,
        name: "fob",
        length: 250
    })
    fob: string;

    @Column('varchar', {
        nullable: false,
        name: "qty_per_season",
        length: 250
    })
    qtyPerSeason: string;

    @Column('int',{
        nullable:false,
        name:"location_id"
    })
    locationId:number;

    @Column('varchar', {
        nullable: true,
        name: "file_name",
        length: 250
    })
    fileName: string;

    @Column('varchar', {
        nullable: true,
        name: "file_path",
        length: 250
    })
    filePath: string;

    @Column('varchar',{
        nullable:true,
        name:'category_type',
        length:250
    })
    categoryType:string;
}