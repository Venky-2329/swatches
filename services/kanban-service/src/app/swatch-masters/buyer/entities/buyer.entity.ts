import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('swatch_buyer')
export class BuyerEntity {

    @PrimaryGeneratedColumn("increment" , {name: 'buyer_id'})
    buyerId : number;

    @Column('varchar',{name:'buyer_name' , length: 60})
    buyerName : string;

    @Column('varchar',{
        name:'buyer_code' , 
        length: 60
    })
    buyerCode : string;

    @Column("varchar" , {name:'created_user' , length:50,nullable: true })
    createdUser: string;

    @Column("varchar" , {name: 'updated_user' , length: 50,nullable: true})
    updatedUser : string;

    @Column({
        nullable: false,
        name: "is_active",
        default: 1
    })
    isActive: boolean;

    @CreateDateColumn({
        name: "created_at",
        type: "datetime"
    })
    createdAt: Date;

    @CreateDateColumn({
        name: "updated_at",
        type: "datetime"
    })
    updatedAt: Date;
    
}
