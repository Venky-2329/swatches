import { CommonAxiosServicePms } from '../common-axios-service-prs';
import { supplierDto, supplierReq } from 'libs/shared-models';


export class SupplierService  extends CommonAxiosServicePms{
    private SupplierController = '/supplier'
    URL : string;

    async createSupplier(req: any): Promise<any> {
        return await this.axiosPostCall(this.SupplierController +'/createSupplier', req );
    }

    async getAllActiveSuppliers(): Promise<any> {
        return await this.axiosPostCall(this.SupplierController +'/getAllActiveSuppliers' );
    }

    async updateSuppliers(dto : supplierDto): Promise<any> {
        return await this.axiosPostCall(this.SupplierController +'/updateSuppliers'  , dto);
    }

    async activateOrDeactivateSupplier(dto : supplierReq): Promise<any> {
        return await this.axiosPostCall(this.SupplierController +'/activateOrDeactivateSupplier',dto );
    }

    async getAllSuppliers():Promise<any>{
        return await this.axiosPostCall(this.SupplierController + '/getAllSuppliers')
    }
}
