import { CommonResponseModel, DateReq, FabricSwatchDto, SwatchStatus } from "libs/shared-models"
import { CommonAxiosServicePms } from '../common-axios-service-prs';

export class FabricSwatchService extends CommonAxiosServicePms{
    URL = '/fabric-swatch'

    async createFabricSwatch(req: FabricSwatchDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL + "/createFabricSwatch",req)
    }

    async uploadPhoto(file: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/photoUpload', file);
    }

    async getAllFabricSwatchData(req?:DateReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/getAllFabricSwatchData',req);
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