import { Module } from "@nestjs/common";
import { PdfReaderService } from "./pdf-reader.service";
import { PdfReaderController } from "./pdf-reader.controller";
import { PdfReaderEntityRepository } from "./entity/pdf-reader.repo";
import { PdfReaderChildEntityRepository } from "./entity/pdf-reader-child.repo";

@Module({
    providers : [PdfReaderService,PdfReaderEntityRepository,PdfReaderChildEntityRepository],
    controllers :[PdfReaderController]
})
export class PdfReaderModule{}