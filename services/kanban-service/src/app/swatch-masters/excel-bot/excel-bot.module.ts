import { Module } from "@nestjs/common";
import { ExcelBotController } from "./excel-bot.controller";
import { ExcelBotService } from "./excel-bot.service";
import { ApplicationExceptionHandler } from "libs/backend-utils";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BuyerWiseExcelEntity } from "./entities/buyer-wise-excel-entity";
import { FabricItemEntity } from "../fabric-swatch/entities/fabric-item.entity";
import { ItemExcelEntity } from "./entities/item-excel.entity";
import { TrimItemEntity } from "../trim-swatch/entities/trim-item-entity";
import { BuyerEntity } from "../buyer/entities/buyer.entity";
import { POItemExcelEntity } from "./entities/po-item-excel.entity";

@Module({
    imports:[TypeOrmModule.forFeature([BuyerWiseExcelEntity,FabricItemEntity,ItemExcelEntity,TrimItemEntity,BuyerEntity,POItemExcelEntity])],
    providers: [ExcelBotService,ApplicationExceptionHandler],
    controllers:[ExcelBotController]
})
export class ExcelBotModule{}