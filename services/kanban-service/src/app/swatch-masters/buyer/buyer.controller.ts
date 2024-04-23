import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerDto } from './dto/buyer.dto';
import { CommonResponseModel } from 'libs/shared-models';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('buyer')
@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) { }

  @Post('/createBuyer')
  @ApiBody({ type: BuyerDto })
  async createBuyer(@Body() req: any, isUpdate: boolean = false): Promise<CommonResponseModel> {
    try {
      return this.buyerService.createBuyer(req, isUpdate);
    } catch (err) {
      console.log(err)
    }
  }

  @Post('/getAllBuyers')
  async getAllBuyers(): Promise<CommonResponseModel> {
    try {
      return this.buyerService.getAllBuyers();
    } catch (err) {
      console.log(err)
    }
  }

  @Post('/getAllActiveBuyers')
  async getAllActiveBuyers(): Promise<CommonResponseModel> {
    try {
      return this.buyerService.getAllActiveBuyers();
    } catch (err) {
      console.log(err)
    }
  }

  @Post('/activateOrDeactivateBuyer')
  async activateOrDeactivateBuyer(@Body() req: any): Promise<CommonResponseModel> {
    try {
      return await this.buyerService.activateOrDeactivateBuyer(req)
    } catch (error) {
      console.log(error);

    }
  }


  @Post('/updateBuyers')
  @ApiBody({ type: BuyerDto })
  async updateBuyers(@Body() BuyerDto: any, isUpdate: boolean = true): Promise<CommonResponseModel> {
    try {
      return this.buyerService.createBuyer(BuyerDto, isUpdate);
    } catch (err) {
      console.log(err)
    }
  }
}
