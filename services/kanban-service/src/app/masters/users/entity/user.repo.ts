import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserEntityRepository extends Repository<UserEntity>{
    constructor(private dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
    }
}