import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('buyer_wise_excel')
export class BuyerWiseExcelEntity{
    @PrimaryGeneratedColumn('increment',{
        name: 'id'
    })
    id: number
}