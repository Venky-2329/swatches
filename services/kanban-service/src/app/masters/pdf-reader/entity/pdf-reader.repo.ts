import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PdfReaderEntity } from "./pdf-reader.entity";

@Injectable()
export class PdfReaderEntityRepository extends Repository<PdfReaderEntity>{
    constructor(private dataSource: DataSource) {
        super(PdfReaderEntity, dataSource.createEntityManager());
    }
}