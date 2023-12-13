import { Body, Controller, Post } from "@nestjs/common";
import { CommonResponseModel } from "libs/shared-models";
import { UserService } from "./user.service";

@Controller('users')
export class UsersController {
  constructor(private readonly service: UserService) {}

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

  @Post('/login')
  async login(@Body() req:any): Promise<CommonResponseModel> {
    try {
      return this.service.login(req);
    } catch (err) {
      console.log(err);
    }
  }
}