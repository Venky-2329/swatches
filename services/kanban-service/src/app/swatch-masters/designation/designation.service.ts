import { Injectable } from "@nestjs/common";
import { DesignationRepository } from "./repository/designation.repo";
import { DesignationEntity } from "./entity/designation.entity";
import { CommonResponseModel } from "libs/shared-models";

@Injectable()
export class DesignationService {

    constructor(
        // @InjectRepository(DesignationEntity)
        private repository: DesignationRepository
      ) { }

      async getAllDesignations(): Promise<CommonResponseModel> {
        try{
          const data = await this.repository.find();
          if (data.length> 0) {
            return new CommonResponseModel(true,990,'data retrieve successfully',data)
          }else{
            return new CommonResponseModel(false,990,'something went to wrong')
          }
        }catch (error){
          throw error
        }
       
      }
}