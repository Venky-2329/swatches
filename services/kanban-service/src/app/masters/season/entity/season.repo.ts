import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SeasonEntity } from "./season.entity";

@Injectable()
export class SeasonEntityRepository extends Repository<SeasonEntity>{
    constructor(private dataSource: DataSource) {
        super(SeasonEntity, dataSource.createEntityManager());
    }
}