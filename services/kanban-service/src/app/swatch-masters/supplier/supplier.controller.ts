import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { SupplierService } from "./supplier.service";
import { CommonResponseModel, supplierDto } from "libs/shared-models";
import { ApplicationExceptionHandler } from "libs/backend-utils"

@ApiTags('supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService,
    private readonly appHandler: ApplicationExceptionHandler) {}

  @Post('/createSupplier')
  @ApiBody({type:supplierDto})
  async createSupplier(@Body() req: any , isUpdate : boolean = false) : Promise <CommonResponseModel> {
    try{
    return this.supplierService.createSupplier(req , isUpdate)
  } catch(err) {
    console.log(err)
  }
  }

  @Post ('/getAllSuppliers')
  async getAllSuppliers(): Promise<CommonResponseModel>{
    try {
      return this.supplierService.getAllSuppliers();
    } catch (error) {
      console.log(error)
    }
  }

  @Post('/getAllActiveSuppliers')
  async getAllActiveSuppliers(): Promise<CommonResponseModel>{
    try {
      return this.supplierService.getAllActiveSuppliers();
    } catch (error) {
      console.log(error)
    }
  }

  @Post('/activateOrDeactivateSupplier')
  async activateOrDeactivateSupplier(@Body() req: any):Promise <CommonResponseModel>{
    try {
      return await this.supplierService.activateOrDeactivateSupplier(req)
    } catch (error) {
      return this.appHandler.returnException(CommonResponseModel,error)
    }
  }

  @Post('/updateSuppliers')
  @ApiBody({type:supplierDto})
  async updateSuppliers(@Body() dto: any, isUpdate : boolean = false):Promise <CommonResponseModel>{
    try {
      return await this.supplierService.createSupplier(dto , isUpdate)
    } catch (error) {
      console.log(error)
    }
  }
}