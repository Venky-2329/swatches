import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RacksChildEntity } from "./racks-child.entity";

@Injectable()
export class RacksChildEntityRepository extends Repository<RacksChildEntity>{
    constructor(private dataSource: DataSource) {
        super(RacksChildEntity, dataSource.createEntityManager());
    }
}