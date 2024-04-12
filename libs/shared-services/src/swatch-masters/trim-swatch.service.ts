import { CommonResponseModel, DateReq,  ReportReq,  TrimSwatchDto, TrimSwatchStatus } from "libs/shared-models";
import { CommonAxiosServicePms } from "../common-axios-service-prs";
import { Console } from "console";

export class TrimSwatchService extends CommonAxiosServicePms{
    URL = '/trim-swatch'

    async createTrimSwatch(req: TrimSwatchDto):Promise<CommonResponseModel>{
        console.log(req.supplierId,'999999999999999999')
        return this.axiosPostCall(this.URL + '/createTrimSwatch',req)
    }

    async photoUpload(file: any):Promise<CommonResponseModel>{
        console.log(file,';shared ser')
        return this.axiosPostCall(this.URL + '/photoUpload',file)
    }

    async getAllTrimSwatchData(req?: DateReq):Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL + '/getAllTrimSwatchData',req)
    }

    async statusCount(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/statusCount');
    }

    async updateApprovedStatus(req?:TrimSwatchStatus): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/updateApprovedStatus',req);
    }

    async updateRejectedStatus(req?:TrimSwatchStatus): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/updateRejectedStatus',req);
    }

    async getDataById(req: TrimSwatchStatus):Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/getDataById',req)
    }
    
    async getGrnNo():Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/getGrnNo')
    }

    async getPoNo():Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/getPoNo')
    }

    async getStyleNo():Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/getStyleNo')
    }

    async getItemNo():Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/getItemNo')
    }

    async getSwatchNo():Promise<CommonResponseModel>{
        return this.axiosPostCall(this.URL+ '/getSwatchNo')
    }

    async updateReworkStatus(req?:TrimSwatchStatus): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/updateReworkStatus',req);
    }

    async reworkSentForApproval(req?:TrimSwatchStatus): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/reworkSentForApproval',req);
    }

    async getApprovedBy(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/getApprovedBy');
    }

    async getCreatedBy(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/getCreatedBy');
    }

    async getStatus(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/getStatus');
    }

    async getTrimNumber(): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/getTrimNumber');
    }

    async getReport(req ?: ReportReq): Promise<CommonResponseModel> {
        return this.axiosPostCall(this.URL+ '/getReport' , req);
    }
}