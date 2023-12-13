import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CategoryEntity } from "./category.entity";

@Injectable()
export class CategoryEntityRepository extends Repository<CategoryEntity>{
    constructor(private dataSource: DataSource) {
        super(CategoryEntity, dataSource.createEntityManager());
    }
}