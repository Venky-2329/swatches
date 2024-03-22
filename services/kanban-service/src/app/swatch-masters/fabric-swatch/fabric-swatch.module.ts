import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FabricSwatchEntity } from "./fabric-swatch-entity";
import { FabricSwatchService } from "./fabric-swatch.service";
import { FabricSwatchController } from "./fabric-swatch.controller";
import { ApplicationExceptionHandler } from "libs/backend-utils";

@Module({
    imports:[TypeOrmModule.forFeature([FabricSwatchEntity])],
    providers : [FabricSwatchService,ApplicationExceptionHandler],
    controllers :[FabricSwatchController],
})
export class FabricSwatchModule{}