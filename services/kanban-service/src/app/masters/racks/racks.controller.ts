import { Body, Controller,Post } from '@nestjs/common';
import { RacksService } from './racks.service';
import { CommonResponseModel } from 'libs/shared-models';


@Controller('racks')
export class RacksController {
  constructor(private readonly racksService: RacksService) {}

  @Post('/saveRacks')
  async saveRacks(@Body() req:any): Promise<CommonResponseModel> {
    try {
      return this.racksService.saveRacks(req);
    } catch (err) {
      console.log(err);
    }
  }
  @Post('/getData')
  async getData(): Promise<CommonResponseModel> {
    try {
      return this.racksService.getData();
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/getRacksData')
  async getRacksData(): Promise<CommonResponseModel> {
    try {
      return this.racksService.getRacksData();
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/updateRackStatus')
  async updateRackStatus(@Body() req :any): Promise<CommonResponseModel> {
    try {
      return this.racksService.updateRackStatus(req);
    } catch (err) {
      console.log(err);
    }
  }
}
