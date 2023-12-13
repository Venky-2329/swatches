import { Injectable } from '@nestjs/common';
import { CommonResponseModel } from 'libs/shared-models';
import { CategoryEntityRepository } from './entity/category.repo';
import { CategoryEntity } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryEntityRepository,
  ) {}

  async create(dto:any):Promise<CommonResponseModel>{
    const entity = new CategoryEntity();
    entity.categoryName = dto.categoryName;
    entity.createdUser = dto.createdUser;
    const save = await this.categoryRepo.save(entity)
    if (save) return new CommonResponseModel(true, 1, 'Saved successfully');
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async getData(): Promise<CommonResponseModel> {
    const data = await this.categoryRepo.find({where :{isActive : true}})
     if (data) return new CommonResponseModel(true, 1, 'Data retrived successfully',data);
     return new CommonResponseModel(false, 0, 'Something went wrong');
   }
}
