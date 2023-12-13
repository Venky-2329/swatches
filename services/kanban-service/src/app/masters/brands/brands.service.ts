import { Injectable } from '@nestjs/common';
import { BrandsEntityRepository } from './entity/brands.repo';
import { CommonResponseModel } from 'libs/shared-models';
import { BrandsEntity } from './entity/brands.entity';

@Injectable()
export class BrandsService {
  constructor(
    private readonly brandsRepo: BrandsEntityRepository,
  ) {}

  async createBrand (dto:any):Promise<CommonResponseModel>{
    const entity = new BrandsEntity();
    entity.brandName = dto.brandName;
    entity.brandCode = dto.brandCode;
    entity.createdUser = dto.createdUser;
    const save = await this.brandsRepo.save(entity)
    if (save) return new CommonResponseModel(true, 1, 'Brands saved successfully');
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async getData(): Promise<CommonResponseModel> {
    const data = await this.brandsRepo.find({where :{isActive : true}})
     if (data) return new CommonResponseModel(true, 1, 'Data retrived successfully',data);
     return new CommonResponseModel(false, 0, 'Something went wrong');
   }
}
