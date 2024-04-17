import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { CommonResponseModel, ErrorResponse, supplierDto, supplierReq } from 'libs/shared-models';
import { Repository } from 'typeorm';


@Injectable()
export class SupplierService {
  
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly repo : Repository<SupplierEntity>
  ) {}
  
  async createSupplier(dto : supplierDto , isUpdate : boolean): Promise <CommonResponseModel> {
    
      const exisiting =  await this.repo.findOne({where : {supplierCode : dto.supplierCode}})

      if (exisiting && (!isUpdate || (isUpdate && exisiting.supplierId !== dto.supplierId ))){
        return new CommonResponseModel(false , 0 , 'Supplier already exists')
      }

      const entity = new SupplierEntity();
      if (dto.supplierId){
        entity.supplierId = dto.supplierId;
        entity.updatedUser = dto.updatedUser;
        entity.supplierCode = dto.supplierCode;
      }
      entity.supplierName = dto.supplierName;
      entity.createdUser = dto.createdUser;
      entity.supplierCode = dto.supplierCode;

      const save = await this.repo.save(entity);
      console.log(save ,'-----save');

      if (save) return new CommonResponseModel (true ,1 , 'Saved Successfully')
      return new CommonResponseModel(false , 0 , 'Something went wrong ')
       
  }

  async getAllSuppliers():Promise<CommonResponseModel>{
    const data = await this.repo.find({order:{createdAt:'DESC'}});
    if (data){
      return new CommonResponseModel(true , 1 ,'Data retrieved successfully' , data)
    }else{
      return new CommonResponseModel(false ,0 , 'No data found')
    }
  }

  async getAllActiveSuppliers():Promise<CommonResponseModel>{
    const data = await this.repo.find({where :{isActive : true}});
    if (data){
      return new CommonResponseModel(true , 1 ,'Data retrieved successfully' , data)
    }else{
      return new CommonResponseModel(false ,0 , 'No data found')
    }
  }

  async activateOrDeactivateSupplier(req : supplierReq):Promise<CommonResponseModel>{
    try {
      const exists = await this.repo.findOne({where: {supplierId : req.supplierId}})

      if (exists){
        if (!exists){
          throw new ErrorResponse(0, 'Someone updated the current Supplier information. Refresh and try again');
        }else{
          const statusUpdate = await this.repo.update(
            {supplierId : req.supplierId},
            {isActive : req.isActive}
          );

          if (exists.isActive){
            if (statusUpdate.affected){
              return new CommonResponseModel (true ,1 ,'Supplier is Deactivated Successfully')
            }else{
              throw new CommonResponseModel (false , 0 ,'Supplier is already deactivated')
            }
          }else{
            if(statusUpdate.affected){
              return new CommonResponseModel (true ,1 ,'Supplier is Activated Successfully')
            }else{
              throw new CommonResponseModel (false , 0 ,'Supplier is already activated')
            }
          }
        }
      }else{
        throw new CommonResponseModel(false, 0, 'No Records Found');
      }
    } catch (error) {
      throw error;
      console.log(error)
    }
  }

}
