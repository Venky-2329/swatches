import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommonFields } from "../../racks/entity/common.entity";

@Entity('sample_user_master')
export class UserEntity extends CommonFields{
    @PrimaryGeneratedColumn('increment', {
        name: 'user_id',
    })
    userId: number

    @Column('varchar', {
        nullable: true,
        name: "user_name",
        length: 250
    })
    userName: string;

    @Column('varchar', {
        nullable: true,
        name: "password",
        length: 250
    })
    password: string;

}