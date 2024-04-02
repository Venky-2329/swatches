import { Injectable } from '@nestjs/common';
import { BrandsEntityRepository } from './entity/brands.repo';
import { BrandDto, CommonResponseModel } from 'libs/shared-models';
import { BrandsEntity } from './entity/brands.entity';

@Injectable()
export class BrandsService {
  constructor(private readonly brandsRepo: BrandsEntityRepository) {}

  async createBrand(
    dto: any
    // isUpdate: Boolean
  ): Promise<CommonResponseModel> {
    console.log(dto);
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
    const data = await this.brandsRepo.find({ where: { isActive: true } });
    if (data)
      return new CommonResponseModel(
        true,
        1,
        'Data retrived successfully',
        data
      );
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async deleteBrands(req: any): Promise<CommonResponseModel> {
    const deleteBrands = await this.brandsRepo.update(
      { brandId: req.brandId },
      { isActive: false }
    );
    if (deleteBrands.affected)
      return new CommonResponseModel(true, 1, 'Brand Deleted');
    return new CommonResponseModel(false, 0, 'Error while deleting Brand');
  }
}
