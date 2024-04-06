import { Body, Controller, Post } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CommonResponseModel } from 'libs/shared-models';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post('/createBrand')
  async createBrand(@Body() req: any): Promise<CommonResponseModel> {
    try {
      return this.brandsService.createBrand(req);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/getData')
  async getData(): Promise<CommonResponseModel> {
    try {
      return this.brandsService.getData();
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/updateBrands')
  async updateBrands(
    @Body() dto: any,
    isUpdate: boolean = false
  ): Promise<CommonResponseModel> {
    try {
      return this.brandsService.createBrand(dto);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/activateOrDeactivateBrands')
  async activateOrDeactivateBrands(@Body() req: any): Promise<CommonResponseModel> {
    try {
      return await this.brandsService.activateOrDeactivateBrands(req);
    } catch (err) {
      return err;
    }
  }
}
