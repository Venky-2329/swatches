import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FabricSwatchService } from "./fabric-swatch.service";
import { FabricSwatchController } from "./fabric-swatch.controller";
import { ApplicationExceptionHandler } from "libs/backend-utils";
import { MailerService } from "./send-mail";
import { FabricSwatchEntity } from "./entities/fabric-swatch-entity";
import { FabricUploadEntity } from "./entities/fabric-swatch-upload-entity";

@Module({
    imports:[TypeOrmModule.forFeature([FabricSwatchEntity,FabricUploadEntity])],
    providers : [FabricSwatchService,ApplicationExceptionHandler,MailerService],
    controllers :[FabricSwatchController],
})
export class FabricSwatchModule{}