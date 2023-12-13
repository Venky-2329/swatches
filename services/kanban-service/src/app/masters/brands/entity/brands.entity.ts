import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommonFields } from "../../racks/entity/common.entity";

@Entity('sample_brands_master')
export class BrandsEntity extends CommonFields{
    @PrimaryGeneratedColumn('increment', {
        name: 'brand_id',
    })
    brandId: number

    @Column('varchar', {
        nullable: true,
        name: "brand_name",
        length: 250
    })
    brandName: string;

    @Column('varchar', {
        nullable: true,
        name: "brand_code",
        length: 250
    })
    brandCode: string;

}