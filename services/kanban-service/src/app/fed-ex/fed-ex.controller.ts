import { Body, Controller, Post, Query } from "@nestjs/common";
import { FedExService } from "./fed-ex.service";
import { CommonResponseModel } from "libs/shared-models";


@Controller('fed-ex-controller')
export class FedExController {
    constructor(
        private fedExService: FedExService
    ) { }

    @Post('/createAuthTokenForFedExApi')
    async createAuthTokenForFedExApi( ): Promise<CommonResponseModel> {
      try{
        return this.fedExService.createAuthTokenForFedExApi();
      } catch(err){
        console.log(err)
      }
    }

    @Post('/fedExShipmentCreation')
    async fedExShipmentCreation( @Body() dto :any ): Promise<CommonResponseModel> {
      try{
        return this.fedExService.fedExShipmentCreation(dto);
      } catch(err){
        console.log(err)
      }
    }

    @Post('/saveShipmentDetails')
    async saveShipmentDetails( @Body() dto :any): Promise<CommonResponseModel> {
      try{
        return this.fedExService.saveShipmentDetails(dto);
      } catch(err){
        console.log(err)
      }
    }

    @Post('/getShippedData')
    async getShippedData( ): Promise<CommonResponseModel> {
      try{
        return this.fedExService.getShippedData();
      } catch(err){
        console.log(err)
      }
    }

}