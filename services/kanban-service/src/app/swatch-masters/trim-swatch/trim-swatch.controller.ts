import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { TrimSwatchService } from './trim-swatch.service';
import { TrimSwatchDto } from './dto/trim-swatch.dto';
import { CommonResponseModel, DateReq, TrimSwatchStatus } from 'libs/shared-models';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FilesInterceptor('file', 10, {
  storage: diskStorage({
    destination:'./upload-files',
    filename: (req, file, callback) => {
      const name = `Trim-`+file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      callback(null, `${name}-${randomName}${fileExtName}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(png|jpeg|PNG|jpg|JPG)$/)) {
      return callback(new Error('Only png,jpeg,PNG,jpg,JPG files are allowed!'), false);
    }
    callback(null, true);
  },
}))
async photoUpload(@UploadedFiles() file: File[], @Body() uploadData: any): Promise<CommonResponseModel> {
  try {
    console.log(file,'-=-=====-=-=-=-=-=-=-')
    return await this.service.updatePath(file, uploadData.trimSwatchId)
  } catch (error) {
    return this.appHandler.returnException(CommonResponseModel, error);
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

@Post('/getGrnNo')
async getGrnNo():Promise<CommonResponseModel>{
  try {
    return await this.service.getGrnNo();
  } catch (error) {
    return this.appHandler.returnException(CommonResponseModel,error)
  }
}

@Post('/getPoNo')
async getPoNo():Promise<CommonResponseModel>{
  try {
    return await this.service.getPoNo();
  } catch (error) {
    return this.appHandler.returnException(CommonResponseModel,error)
  }
}

@Post('/getStyleNo')
async getStyleNo():Promise<CommonResponseModel>{
  try {
    return await this.service.getStyleNo();
  } catch (error) {
    return this.appHandler.returnException(CommonResponseModel,error)
  }
}
@Post('/getItemNo')
async getItemNo():Promise<CommonResponseModel>{
  try {
    return await this.service.getItemNo();
  } catch (error) {
    return this.appHandler.returnException(CommonResponseModel,error)
  }
}

@Post('/getSwatchNo')
async getSwatchNo():Promise<CommonResponseModel>{
  try {
    return await this.service.getSwatchNo();
  } catch (error) {
    return this.appHandler.returnException(CommonResponseModel,error)
  }
}

@Post('/updateReworkStatus')
@ApiBody({type: TrimSwatchStatus})
async updateReworkStatus(@Body() req: any): Promise<CommonResponseModel>{
    try{
        return await this.service.updateReworkStatus(req)
    }catch(err){
        return this.appHandler.returnException(CommonResponseModel,err)
    }
}

@Post('/reworkSentForApproval')
async reworkSentForApproval(@Body() req: any):Promise<CommonResponseModel>{
  try {
    return await this.service.reworkSentForApproval(req);
  } catch (error) {
    return this.appHandler.returnException(CommonResponseModel,error)
  }
}

@Post('/getApprovedBy')
async getApprovedBy():Promise<CommonResponseModel>{
  try {
    return await this.service.getApprovedBy();
  } catch (error) {
    return this.appHandler.returnException(CommonResponseModel,error)
  }
}

@Post('/getCreatedBy')
async getCreatedBy():Promise<CommonResponseModel>{
  try {
    return await this.service.getCreatedBy();
  } catch (error) {
    return this.appHandler.returnException(CommonResponseModel,error)
  }
}

@Post('/getStatus')
async getStatus():Promise<CommonResponseModel>{
  try {
    return await this.service.getStatus();
  } catch (error) {
    return this.appHandler.returnException(CommonResponseModel,error)
  }
}

// @Post('/getTrimNumber')
// async getTrimNumber():Promise<CommonResponseModel>{
//   try {
//     return await this.service.getTrimNumber();
//   } catch (error) {
//     return this.appHandler.returnException(CommonResponseModel,error)
//   }
// }

@Post('/getReport')
async getReport(@Body() req:any):Promise<CommonResponseModel>{
  try {
    return await this.service.getReport(req);
  } catch (error) {
    return this.appHandler.returnException(CommonResponseModel,error)
  }
}

@Post('/deleteImage')
@ApiBody({type: TrimSwatchStatus})
async deleteImage(@Body() req: any): Promise<CommonResponseModel>{
    try{
        return await this.service.deleteImage(req)
    }catch(err){
        return this.appHandler.returnException(CommonResponseModel,err)
    }
}

}
