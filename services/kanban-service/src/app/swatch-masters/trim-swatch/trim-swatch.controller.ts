import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TrimSwatchService } from './trim-swatch.service';
import { TrimSwatchDto } from './dto/trim-swatch.dto';
import { CommonResponseModel } from 'libs/shared-models';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApplicationExceptionHandler } from 'libs/backend-utils';


@Controller('trim-swatch')
export class TrimSwatchController {
  constructor(private readonly service: TrimSwatchService,
    private readonly appHandler: ApplicationExceptionHandler) {}

  @Post('/createTrimSwatch')
  @ApiBody({type : TrimSwatchDto})
  async createTrimSwatch(@Body() req: any):Promise<CommonResponseModel> {
  try {
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


  @ApiBody({type : TrimSwatchDto})
  @Post('/getAllTrimSwatchData')
  async getAllTrimSwatchData():Promise<CommonResponseModel>{
    try {
      return this.service.getAllTrimSwatchData();
    } catch (error) {
      console.log(error)
    }
  }

}
