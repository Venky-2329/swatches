import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TrimSwatchService } from './trim-swatch.service';
import { TrimSwatchDto } from './dto/trim-swatch.dto';
import { CommonResponseModel, DateReq, TrimSwatchStatus } from 'libs/shared-models';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApplicationExceptionHandler } from 'libs/backend-utils';
import { MailerService } from '../fabric-swatch/send-mail';


@Controller('trim-swatch')
export class TrimSwatchController {
  constructor(private readonly service: TrimSwatchService,
    private readonly appHandler: ApplicationExceptionHandler,
    private readonly mailService : MailerService) {}

  @Post('/createTrimSwatch')
  @ApiBody({type : TrimSwatchDto})
  async createTrimSwatch(@Body() req: any):Promise<CommonResponseModel> {
  try {
    console.log(req,'fgggggddhdj')
        return this.service.createTrimSwatch(req);
  } catch (error) {
    return  this.appHandler.returnException(CommonResponseModel,error)
  }  
  }

  @Post('/photoUpload')
  @ApiBody({type : TrimSwatchDto})
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file' , {
    limits : {files:1},
    storage : diskStorage({
      destination: './upload-files',
      filename: (req , file , callback) => {
        const name = file.originalname.split('.')[0];
        const fileExtName = extname(file.originalname);
        const randomName = Array(4)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('')
        callback(null,`${name}-${randomName}${fileExtName}`);

      },
    }),
    fileFilter: (req , file , callback) => {
      if (!file.originalname.match(/\.(png|jpeg|PNG|jpg|JPG)$/)){
        return callback(new Error ('Only png,jpeg,PNG,jpg,JPG files are allowed!'),false);
      }
      callback(null,true)
    },
  }))


  @ApiBody({type : TrimSwatchDto})

  async photoUpload(@UploadedFile() file , @Body() uploadData: any): Promise<CommonResponseModel>{
    try {
      return this.service.updatePath(file.path,file.filename,uploadData.id);
    } catch (error) {
      console.log(error)
    }
  }


  @ApiBody({type:DateReq})
  @Post('/getAllTrimSwatchData')
  async getAllTrimSwatchData(@Body() req: any):Promise<CommonResponseModel>{
    try {
      return this.service.getAllTrimSwatchData(req);
    } catch (error) {
      console.log(error)
    }
  }

  @Post('/statusCount')
  async statusCount(): Promise<CommonResponseModel>{
      try{
          return await this.service.statusCount()
      }catch(err){
          return this.appHandler.returnException(CommonResponseModel,err)
      }
  }

  @Post('/updateApprovedStatus')
  @ApiBody({type: TrimSwatchStatus})
  async updateApprovedStatus(@Body() req: any): Promise<CommonResponseModel>{
      try{
        console.log(req,'...............controller................')
          return await this.service.updateApprovedStatus(req)
      }catch(err){
          return this.appHandler.returnException(CommonResponseModel,err)
      }
  }

  @Post('/updateRejectedStatus')
  @ApiBody({type: TrimSwatchStatus})
  async updateRejectedStatus(@Body() req: any): Promise<CommonResponseModel>{
      try{
          return await this.service.updateRejectedStatus(req)
      }catch(err){
          return this.appHandler.returnException(CommonResponseModel,err)
      }
  }

  @Post('/getDataById')
  @ApiBody({type: TrimSwatchStatus})
  async getDataById(@Body() req: any): Promise<CommonResponseModel>{
      try{
          return await this.service.getDataById(req)
      }catch(err){
          return this.appHandler.returnException(CommonResponseModel,err)
      }
  }

  @Post('/sendSwatchMail')
  async sendSwatchMail(@Body() req: any): Promise<CommonResponseModel> {
    try {
      return await this.mailService.sendSwatchMail(req);
    } catch (error) {
      console.log('----------error in send mail controller')
      console.log(error)
      console.log('-------End in Controller')
      return this.appHandler.returnException(CommonResponseModel, error);
    }
}
}
