import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PdfReaderChildEntity } from "./pdf-child.entity";

@Injectable()
export class PdfReaderChildEntityRepository extends Repository<PdfReaderChildEntity>{
    constructor(private dataSource: DataSource) {
        super(PdfReaderChildEntity, dataSource.createEntityManager());
    }
}