import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApprovalUsersService } from './approval-users.service';
import { ApplicationExceptionHandler } from 'libs/backend-utils';
import { CommonResponseModel } from 'libs/shared-models';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller("/approval-user")
export class ApprovalUsersController {
  constructor(
    private readonly service: ApprovalUsersService,
    private readonly appHandler: ApplicationExceptionHandler
  ) { }

  @Post('/createApprovalUser')
  async createApprovalUser(@Body() dto: any): Promise<CommonResponseModel> {
    try {
      return await this.service.createApprovalUser(dto);
    } catch (error) {
      console.log(error, 'err')
      return this.appHandler.returnException(CommonResponseModel, error);
    }
  }

  @Post('/fileUpload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    limits: { files: 1 },
    storage: diskStorage({
      destination: './upload-files',
      filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0];
        const fileExtName = extname(file.originalname);
        const randomName = Array(4)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        callback(null, `${name}-${randomName}${fileExtName}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(png|jpeg|PNG|jpg|JPG|pjpeg|gif|tiff|x-tiff|x-png)$/)) {
        return callback(new Error('Only png,jpeg,PNG,jpg,gif,tiff,x-tiff,z-png files are allowed!'), false);
      }
      callback(null, true);
    },
  }))

  async imageUpload(@UploadedFile() file, @Body() uploadData: any): Promise<CommonResponseModel> {
    try {
      return await this.service.updatePath(file.path, file.filename, uploadData.approvedId)
    } catch (error) {
      return this.appHandler.returnException(CommonResponseModel, error);
    }
  }

  @Get('/getAllApprovalUser')
  async getAllApprovalUser(): Promise<CommonResponseModel> {
    try {
      return await this.service.getAllApprovalUser();
    } catch (error) {
      console.log(error, 'err')
      return this.appHandler.returnException(CommonResponseModel, error);
    }
  }

  @Post('/getAllApprovalIdUser')
  async getAllApprovalIdUser(@Body() req: any): Promise<CommonResponseModel> {
    try {
      return await this.service.getAllApprovalIdUser(req);
    } catch (error) {
      console.log(error, 'err')
      return this.appHandler.returnException(CommonResponseModel, error);
    }
  }

  @Post('/activateOrDeactivateUser')
  async activateOrDeactivateUser(@Body() req: any): Promise<CommonResponseModel> {
    try {
      return await this.service.activateOrDeactivateUser(req);
    } catch (error) {
      // console.log(error, 'err')
      return this.appHandler.returnException(CommonResponseModel, error);
    }
  }

  @Get('/getAllActiveApprovalUser')
  async getAllActiveApprovalUser(): Promise<CommonResponseModel> {
    try {
      return await this.service.getAllActiveApprovalUser();
    } catch (error) {
      console.log(error, 'err')
      return this.appHandler.returnException(CommonResponseModel, error);
    }
  }

}

