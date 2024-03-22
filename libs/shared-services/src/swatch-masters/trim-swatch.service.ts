import { CommonResponseModel, TrimSwatchDto } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";

export class TrimSwatchService extends CommonAxiosServicePms{
    URL = '/trim-swatch'

    async createTrimSwatch(req: TrimSwatchDto):Promise<CommonResponseModel>{
        console.log(req.supplierId,'999999999999999999')
        return this.axiosPostCall(this.URL + '/createTrimSwatch',req)
    }

    async photoUpload(file: any):Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL + '/photoUpload',file)
    }

    async getAllTrimSwatchData():Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL + '/getAllTrimSwatchData')
    }

}