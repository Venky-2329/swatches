import { CommonResponseModel, CreateDepartmentDto, DepartmentIdReq } from "libs/shared-models";
import { AxiosRequestConfig } from "axios";
import { CommonAxiosServicePms } from "../../common-axios-service-prs";


export class DepartmentService extends CommonAxiosServicePms {
      private DepartmentController = '/departmentdata'
    
    async createDepartment(createDto: CreateDepartmentDto, config?: AxiosRequestConfig): Promise<any> {
        return await this.axiosPostCall(this.DepartmentController +'/createDepartment', createDto, config);
    }
    async getAllDepartments(): Promise<any> {
        return await this.axiosPostCall(this.DepartmentController + '/getAllDepartments')
    }

    async getAllSectionsForDrop(Req:DepartmentIdReq): Promise<CommonResponseModel> {
        return await this.axiosPostCall(this.DepartmentController + '/getAllSectionsForDrop',Req)
    }

}




