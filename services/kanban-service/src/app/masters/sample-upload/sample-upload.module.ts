import { Module } from "@nestjs/common";
import { SampleUploadService } from "./sample-upload.service";
import { SampleUploadRepository } from "./entity/sample-upload.repo";
import { SampleUploadController } from "./sample-upload.controller";

@Module({
    providers : [SampleUploadService,SampleUploadRepository],
    controllers :[SampleUploadController]
})
export class SampleUploadModule{}