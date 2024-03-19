import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { SupplierService } from "./supplier.service";
import { CommonResponseModel, SupplierDto } from "libs/shared-models";

@ApiTags('buyer')
@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: SupplierService) {}

  @Post('/createBuyer')
  @ApiBody({type:SupplierDto})
  async createSupplier(@Body() BuyerDto: any , isUpdate : boolean = false) : Promise <CommonResponseModel> {
    try{
      console.log(BuyerDto,'............................')
    return 
    // this.buyerService.createSupplier(BuyerDto , isUpdate);
  } catch(err) {
    console.log(err)
  }
  }
}