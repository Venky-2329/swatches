import { BuyerReq, CommonResponseModel } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";

export class ExcelBotService extends CommonAxiosServicePms{
    url = '/excel-bot' 

    async getItemCodesByBuyer(req: BuyerReq):Promise<CommonResponseModel>{
        return await this.axiosPostCall(this.url + '/getItemCodesByBuyer',req)
    }

    async getItemDesByCode(req: BuyerReq):Promise<CommonResponseModel>{
        return await this.axiosPostCall(this.url + '/getItemDesByCode',req)
    }

    async getPODataByItemCode(req: BuyerReq):Promise<CommonResponseModel>{
        return await this.axiosPostCall(this.url + '/getPODataByItemCode',req)
    }
}