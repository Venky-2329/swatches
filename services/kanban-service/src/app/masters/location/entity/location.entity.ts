import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommonFields } from "../../racks/entity/common.entity";

@Entity('sample_location_master')
export class LocationEntity extends CommonFields{
    @PrimaryGeneratedColumn('increment', {
        name: 'location_id',
    })
    locationId: number

    @Column('varchar', {
        nullable: true,
        name: "location_name",
        length: 250
    })
    locationName: string;

}