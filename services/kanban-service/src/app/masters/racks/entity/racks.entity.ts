import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommonFields } from "./common.entity";
import { RacksChildEntity } from "./racks-child.entity";

@Entity('racks_master')
export class RacksEntity extends CommonFields{
    @PrimaryGeneratedColumn('increment', {
        name: 'id',
    })
    id: number

    @Column('varchar', {
        nullable: true,
        name: "rack_name",
        length: 250
    })
    rackName: string;

    @Column('int', {
        nullable: true,
        name: "columns",
    })
    columns: number;

    @Column('int', {
        nullable: true,
        name: "rows",
    })
    rows: number;

    @OneToMany(() => RacksChildEntity , (racksChiltEntity) => racksChiltEntity.racks,{cascade :true})
    racksChiltEntity :RacksChildEntity[];

}