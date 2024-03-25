import { ApprovalIdReq, ApprovedUserDto } from "libs/shared-models";
import { CommonAxiosServicePms } from '../../common-axios-service-prs';

export class ApprovalUserService extends CommonAxiosServicePms {
    private AddressController = '/approval-user'
    URL: string;

    async createApprovalUser(createDto: ApprovedUserDto): Promise<any> {
        return await this.axiosPostCall(this.AddressController +'/createApprovalUser', createDto, );
    }

    async approvalUserImageUpload(file: any): Promise<any> {
        return await this.axiosPostCall(this.AddressController + '/fileUpload', file);
    }

    async getAllApprovalUser(): Promise<any> {
        return await this.axiosGetCall(this.AddressController +'/getAllApprovalUser' );
    }

    async getAllApprovalIdUser(req: ApprovalIdReq): Promise<any> {
        return await this.axiosPostCall(this.AddressController + '/getAllApprovalIdUser', req);
    }
}