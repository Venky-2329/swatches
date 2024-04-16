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

    async updateReworkStatus(req?:SwatchStatus): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/updateReworkStatus',req);
    }

    async updateSentForApprovalStatus(req?:SwatchStatus): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/updateSentForApprovalStatus',req);
    }

    async getDataById(req: SwatchStatus):Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/getDataById',req)
    }

    async getAllBuyers():Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/getAllBuyers')
    }

    async getAllCreatedBy():Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/getAllCreatedBy')
    }

    async getAllBrands():Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/getAllBrands')
    }

    async deleteImage(req: SwatchStatus):Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/deleteImage',req)
    }
}