
import { Controller } from '@nestjs/common';
import { Body, Get, Post } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { UnitDto } from './dto/unit.dto';
import { CommonResponseModel, GetAllUnitResponse } from 'libs/shared-models';

@Controller('unitData')
@ApiTags('unitData')

export class UnitController {
  constructor(private readonly service: UnitService) { }



  @Post('createUnit')
  createUnit(@Body() createDto: UnitDto): Promise<CommonResponseModel> {
  //   try {
     return this.service.createUnit(createDto);

  //   }
  
//  catch (error) {
//   return returnException()
// }  
}

  @Get('/getAllUnits')
  async getAllUnits(): Promise<CommonResponseModel> {
    try {
      return await this.service.getAllUnits();
    } catch (error) {
      return (error);
    }
  }

  @Post('/activateOrDeactivateUnits')
  async activateOrDeactivateUnits( @Body() request:any ): Promise<CommonResponseModel> {
    try {
      return await this.service.activateOrDeactivateUnits(request);
    } catch (error) {
      return (error);
    }
  }


}