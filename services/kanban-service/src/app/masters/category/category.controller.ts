import { Body, Controller, Post } from '@nestjs/common';
import { CategoryReq, CommonResponseModel } from 'libs/shared-models';
import { CategoryService } from './category.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post('/create')
  async create(
    @Body() req: any,
    isUpdate: boolean = false
  ): Promise<CommonResponseModel> {
    try {
      return this.service.create(req, isUpdate);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/getData')
  async getData(): Promise<CommonResponseModel> {
    try {
      return this.service.getData();
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/updateCategories')
  async updateCategories(
    @Body() dto: any,
    isUpdate: boolean = false
  ): Promise<CommonResponseModel> {
    try {
      return this.service.create(dto, isUpdate);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/activateOrDeactivate')
  @ApiBody({type: CategoryReq})
  async activateOrDeactivate(@Body() req: any): Promise<CommonResponseModel> {
    try {
      return await this.service.activateOrDeactivate(req);
    } catch (error) {
      console.log(error);
    }
  }
}
