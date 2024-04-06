import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LocationEntity } from "./location.entity";

@Injectable()
export class LocationEntityRepository extends Repository<LocationEntity>{
    constructor(private dataSource: DataSource) {
        super(LocationEntity, dataSource.createEntityManager());
    }
}