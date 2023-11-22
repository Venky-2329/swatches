import { Column, CreateDateColumn, Entity, OneToMany,ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { CommonFields } from "./common.entity";
import { RacksEntity } from "./racks.entity";

@Entity('racks_child_master')
export class RacksChildEntity extends CommonFields{
    @PrimaryGeneratedColumn('increment', {
        name: 'id',
    })
    id: number;

    @Column('varchar', {
        nullable: true,
        name: "sub_rack_name",
        length: 250
    })
    subRackName: string;

    @ManyToOne(() => RacksEntity, (racks) => racks.racksChiltEntity)
    @JoinColumn({ name: "rack_id" })
    racks: RacksEntity;

}
