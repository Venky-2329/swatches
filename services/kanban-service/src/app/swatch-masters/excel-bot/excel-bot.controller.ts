import { Body, Controller, Post } from "@nestjs/common";
import { ExcelBotService } from "./excel-bot.service";
import { BuyerReq, CommonResponseModel } from "libs/shared-models";
import { ApplicationExceptionHandler } from "libs/backend-utils";
import { ApiBody } from "@nestjs/swagger";

@Controller('excel-bot')
export class ExcelBotController{
    constructor(
        private readonly service: ExcelBotService,
        private readonly appHandler: ApplicationExceptionHandler
    ){}

    // @Post('/convertExcelToJsonByApi340')
    // async convertExcelToJsonByApi340():Promise<CommonResponseModel>{
    //     try{
    //         return await this.service.convertExcelToJsonByApi340()
    //     }catch(err){
    //         return this.appHandler.returnException(CommonResponseModel,err)
    //     }
    // }

    @Post('/itemResponsibleReport')
    async itemResponsibleReport():Promise<CommonResponseModel>{
        try{
            return await this.service.itemResponsibleReport()
        }catch(err){
            return this.appHandler.returnException(CommonResponseModel,err)
        }
    }

    @Post('/itemReportExcelData')
    async itemReportExcelData(): Promise<CommonResponseModel> {
        try {
            await this.service.itemReportExcelData();
            return new CommonResponseModel(true,1,'Excel Downloaded')
        } catch (err) {
            console.log(err)
        }
    }

    @Post('/poItemReportExcelData')
    async poItemReportExcelData(): Promise<CommonResponseModel> {
        try {
            await this.service.poItemReportExcelData();
            return new CommonResponseModel(true,1,'Excel Downloaded')
        } catch (err) {
            console.log(err)
        }
    }

    @Post('/getItemCodesByBuyer')
    @ApiBody({type: BuyerReq})
    async getItemCodesByBuyer(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getItemCodesByBuyer(req);
        } catch (err) {
            console.log(err)
        }
    }

    @Post('/getItemDesByCode')
    @ApiBody({type: BuyerReq})
    async getItemDesByCode(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getItemDesByCode(req);
        } catch (err) {
            console.log(err)
        }
    }

    @Post('/getPODataByItemCode')
    @ApiBody({type: BuyerReq})
    async getPODataByItemCode(@Body() req: any): Promise<CommonResponseModel> {
        try {
            return await this.service.getPODataByItemCode(req);
        } catch (err) {
            console.log(err)
        }
    }

}