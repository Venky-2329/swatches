import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SampleUpload } from "./sample-upload.entity";

@Injectable()
export class SampleUploadRepository extends Repository<SampleUpload>{
    constructor(private dataSource: DataSource) {
        super(SampleUpload, dataSource.createEntityManager());
    }
}