import { Body, Controller, Post } from "@nestjs/common";
import { CommonResponseModel } from "libs/shared-models";
import { LocationService } from "./location.service";

@Controller('location')
export class LocationController {
  constructor(private readonly service: LocationService) {}

  @Post('/create')
  async create(@Body() req:any): Promise<CommonResponseModel> {
    try {
      return this.service.create(req);
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
}