import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { RacksEntity } from "./racks.entity";

@Injectable()
export class RacksEntityRepository extends Repository<RacksEntity>{
    constructor(private dataSource: DataSource) {
        super(RacksEntity, dataSource.createEntityManager());
    }
}