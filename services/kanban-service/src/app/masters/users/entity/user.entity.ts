import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommonFields } from "../../racks/entity/common.entity";
import { RoleEnum } from "libs/shared-models";

@Entity('swatch_users')
export class UserEntity extends CommonFields{
    @PrimaryGeneratedColumn('increment', {
        name: 'user_id',
    })
    userId: number

    @Column('varchar', {
        nullable: false,
        name: "user_name",
        length: 250
    })
    userName: string;

    @Column('varchar', {
        nullable: false,
        name: "password",
        length: 250
    })
    password: string;

    @Column('int', {
        nullable: false,
        name: "employee_id",
    })
    employeeId: number;

    @Column('varchar', {
        nullable: false,
        name: "email",
    })
    email: string;

    @Column('int', {
        nullable: false,
        name: "department_id",
    })
    departmentId: number;

    @Column('enum', {
        nullable: false,
        name: "role",
        enum: RoleEnum 
    })
    role: RoleEnum;

}