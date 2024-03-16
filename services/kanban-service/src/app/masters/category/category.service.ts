import { Injectable } from '@nestjs/common';
import {
  CategoryReq,
  CommonResponseModel,
  ErrorResponse,
  categoryDto,
} from 'libs/shared-models';
import { CategoryEntityRepository } from './entity/category.repo';
import { CategoryEntity } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryEntityRepository) {}

  async create(dto: categoryDto,isUpdate: boolean): Promise<CommonResponseModel> {
    const exisiting = await this.categoryRepo.findOne({where: { categoryName: dto.categoryName }});

    if (exisiting &&(!isUpdate || (isUpdate && exisiting.categoryId !== dto.categoryId))) {
      console.log('coming')
      return new CommonResponseModel(false,1, 'Category already exists');
    }
    const entity = new CategoryEntity();

    console.log(dto, '---------dto');
    if (dto.categoryId) {
      entity.categoryId = dto.categoryId;
    }
    entity.categoryName = dto.categoryName;
    entity.createdUser = dto.createdUser;
    const save = await this.categoryRepo.save(entity);
    console.log(save, '--------save');

    if (save) return new CommonResponseModel(true, 1, 'Saved successfully');
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async getData(): Promise<CommonResponseModel> {
    const data = await this.categoryRepo.find({
      
    });
    if (data)
      return new CommonResponseModel(
        true,
        1,
        'Data retrived successfully',
        data
      );
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async activateOrDeactivate(req: CategoryReq): Promise<CommonResponseModel> {
    try {
      console.log(req,'service')
      const exists = await this.categoryRepo.findOne({
        where: { categoryId: req.categoryId },
      });
      console.log(exists,'exists')
      if (exists) {
        if (!exists) {
          throw new ErrorResponse(0, 'Someone updated the current Address information.Refresh and try again');
        } else {
          const statusUpdate = await this.categoryRepo.update(
            { categoryId: req.categoryId },
            { isActive: req.isActive }
          );
          console.log(statusUpdate,'..statusupdate')
          if (exists.isActive) {
            if (statusUpdate.affected) {
              const response: CommonResponseModel = new CommonResponseModel(
                true,
                1,
                'Category is Deactivated Successfully'
              );
              return response;
            } else {
              throw new CommonResponseModel(
                false,
                0,
                'Category is already deactivated'
              );
            }
          } else {
            if (statusUpdate.affected) {
              return new CommonResponseModel(
                true,
                1,
                'Category is Activated Successfully'
              );
            } else {
              throw new CommonResponseModel(
                false,
                0,
                'Category is already activated'
              );
            }
          }
        }
      } else {
        throw new CommonResponseModel(false, 0, 'No Records Found');
      }
    } catch (error) {
      return error;
    }
  }
}
