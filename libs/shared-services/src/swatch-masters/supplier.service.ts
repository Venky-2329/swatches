import { CommonAxiosServicePms } from '../common-axios-service-prs';
import { SupplierDto, SupplierReq } from 'libs/shared-models';


export class SupplierService  extends CommonAxiosServicePms{
    private SupplierController = '/supplier'
    URL : string;

    async createSupplier(req: any): Promise<any> {
        return await this.axiosPostCall(this.SupplierController +'/createSupplier', req );
    }

    async getAllActiveSuppliers(): Promise<any> {
        return await this.axiosPostCall(this.SupplierController +'/getAllActiveSuppliers' );
    }

    async updateSuppliers(dto : SupplierDto): Promise<any> {
        return await this.axiosPostCall(this.SupplierController +'/updateSuppliers' );
    }

    async activateOrDeactivateSupplier(dto : SupplierReq): Promise<any> {
        return await this.axiosPostCall(this.SupplierController +'/activateOrDeactivateSupplier' );
    }

    async getAllSuppliers():Promise<any>{
        return await this.axiosPostCall(this.SupplierController + '/getAllSuppliers')
    }
}
