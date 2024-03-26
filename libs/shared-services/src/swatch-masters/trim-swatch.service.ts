import { CommonResponseModel, DateReq, SwatchStatus, TrimSwatchDto } from "libs/shared-models";
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

    async getAllTrimSwatchData(req?: DateReq):Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL + '/getAllTrimSwatchData',req)
    }

    async statusCount(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/statusCount');
    }

    async updateApprovedStatus(req?:SwatchStatus): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/updateApprovedStatus',req);
    }

    async updateRejectedStatus(req?:SwatchStatus): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/updateRejectedStatus',req);
    }

    async getDataById(req: SwatchStatus):Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/getDataById',req)
    }
}