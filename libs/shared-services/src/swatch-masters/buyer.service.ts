import { API_URL } from 'libs/shared-services/config';
import { CommonAxiosServicePms } from '../common-axios-service-prs';
import { BuyerDto, BuyerReq } from 'libs/shared-models';

// const endPoint = API_URL + '/buyers';

export class BuyerService  extends CommonAxiosServicePms{
    private BuyerController = '/buyer'
    URL : string;

    async createBuyer(req: any): Promise<any> {
        return await this.axiosPostCall(this.BuyerController +'/createBuyer', req );
    }

    async getAllActiveBuyers(): Promise<any> {
        return await this.axiosPostCall(this.BuyerController +'/getAllActiveBuyers' );
    }

    async updateBuyers(dto : BuyerDto): Promise<any> {
        return await this.axiosPostCall(this.BuyerController +'/updateBuyers',dto );
    }

    async activateOrDeactivateBuyer(dto : BuyerReq): Promise<any> {
        return await this.axiosPostCall(this.BuyerController +'/activateOrDeactivateBuyer' ,dto );
    }

    async getAllBuyers():Promise<any>{
        return await this.axiosPostCall(this.BuyerController+'/getAllBuyers')
    }

    async getBuyerCodeByName(req: BuyerReq):Promise<any>{
        return await this.axiosPostCall(this.BuyerController+'/getBuyerCodeByName',req)
    }

    async getBuyers():Promise<any>{
        return await this.axiosPostCall(this.BuyerController+'/getBuyers')
    }
}
