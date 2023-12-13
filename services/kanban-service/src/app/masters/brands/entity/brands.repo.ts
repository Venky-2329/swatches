import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { BrandsEntity } from "./brands.entity";

@Injectable()
export class BrandsEntityRepository extends Repository<BrandsEntity>{
    constructor(private dataSource: DataSource) {
        super(BrandsEntity, dataSource.createEntityManager());
    }
}