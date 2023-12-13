import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommonFields } from "../../racks/entity/common.entity";

@Entity('sample_season_master')
export class SeasonEntity extends CommonFields{
    @PrimaryGeneratedColumn('increment', {
        name: 'season_id',
    })
    seasonId: number

    @Column('varchar', {
        nullable: true,
        name: "season_name",
        length: 250
    })
    seasonName: string;

}