import { CommonResponseModel, FabricSwatchDto } from "libs/shared-models"
import { CommonAxiosServicePms } from '../common-axios-service-prs';

export class FabricSwatchService extends CommonAxiosServicePms{
    URL = '/fabric-swatch'

    async createFabricSwatch(req: FabricSwatchDto): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL + "/createFabricSwatch",req)
    }

    async uploadPhoto(file: any): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/photoUpload', file);
    }

    async getAllFabricSwatchData(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/getAllFabricSwatchData');
    }

    async statusCount(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/statusCount');
    }
}