import { Injectable } from '@nestjs/common';
import { BrandsEntityRepository } from './entity/brands.repo';
import {
  BrandDto,
  CommonResponseModel,
  ErrorResponse,
  brandReq,
} from 'libs/shared-models';
import { BrandsEntity } from './entity/brands.entity';

@Injectable()
export class BrandsService {
  constructor(private readonly brandsRepo: BrandsEntityRepository) { }

  async createBrand(
    dto: any
    // isUpdate: Boolean
  ): Promise<CommonResponseModel> {
    // console.log(dto);
    const entity = new BrandsEntity();
    entity.brandName = dto.brandName;
    entity.brandCode = dto.brandCode;
    entity.createdUser = dto.createdUser;
    entity.updatedUser = dto.updatedUser;
    if (dto.brandId) {
      entity.brandId = dto.brandId;
    }
    const save = await this.brandsRepo.save(entity);
    if (save)
      return new CommonResponseModel(true, 1, 'Brands saved successfully');
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async getData(): Promise<CommonResponseModel> {
    const data = await this.brandsRepo.find({});
    if (data)
      return new CommonResponseModel(
        true,
        1,
        'Data retrived successfully',
        data
      );
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async activateOrDeactivateBrands(req: brandReq): Promise<CommonResponseModel> {
    try {
      const exists = await this.brandsRepo.findOne({
        where: { brandId: req.brandId },
      });
      if (exists) {
        if (!exists) {
          throw new ErrorResponse(
            0,
            'Someone updated the current Brand information. Refresh and try again'
          );
        } else {
          const statusUpdate = await this.brandsRepo.update(
            { brandId: req.brandId },
            { isActive: req.isActive }
          );
          if (exists.isActive) {
            if (statusUpdate.affected) {
              return new CommonResponseModel(true, 1, 'Brand is Deactivated Successfully')
            } else {
              return new CommonResponseModel(true, 1, 'Brand is already deactivated')
            }
          } else {
            if (statusUpdate.affected) {
              return new CommonResponseModel(true, 1, 'Brand is Activated Successfully')
            } else {
              return new CommonResponseModel(true, 1, 'Brand is already activated')
            }
          }
        }
      }
    } catch (error) { }
  }
}
