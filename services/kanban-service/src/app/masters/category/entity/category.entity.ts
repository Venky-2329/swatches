import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommonFields } from "../../racks/entity/common.entity";

@Entity('swatch_category')
export class CategoryEntity extends CommonFields{
    @PrimaryGeneratedColumn('increment', {
        name: 'category_id',
    })
    categoryId: number

    @Column('varchar', {
        nullable: true,
        name: "category_name",
        length: 250
    })
    categoryName: string;

}