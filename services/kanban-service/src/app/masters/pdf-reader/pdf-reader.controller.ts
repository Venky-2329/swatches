import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { extname } from "path";
import * as fs from 'fs';
import { diskStorage, File } from 'multer'; 
import {  FilesInterceptor } from '@nestjs/platform-express'
import { PdfReaderService } from "./pdf-reader.service";
import { CommonResponseModel } from "libs/shared-models";


@Controller('pdf-reader')
export class PdfReaderController {
    constructor(
        private readonly service : PdfReaderService
    ){}

    @Post('/saveData')
    async saveData(@Body() req:any): Promise<CommonResponseModel> {
      console.log('------contr',req)
      try {
        return this.service.saveData(req);
      } catch (err) {
        console.log(err);
      }
    }
    
    @Post('/uploadFiles')
    @UseInterceptors(FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          console.log(file);
          const destinationPath = `./upload_files`;
          try {
            fs.mkdirSync(destinationPath, { recursive: true });
            callback(null, destinationPath);
          } catch (error) {
            console.error('Error creating directory:', error);
            callback(error, null);
          }
        },
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
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
          return callback(new Error('Only jpg, png, jpeg files are allowed!'), false);
        }
        callback(null, true);
      },
    }))
    async uploadFiles(@UploadedFiles() file:File[], @Body() uploadData: any): Promise<CommonResponseModel> {
      console.log(file)
      console.log(uploadData,'###########')
      try {
        return await this.service.updatePath(uploadData,file);
      } catch (error) {
      }
    }

    @Post('/getPdfData')
    async getPdfData(@Body() req:any): Promise<CommonResponseModel> {
      try {
        return this.service.getPdfData(req);
      } catch (err) {
        console.log(err);
      }
    }

    @Post('/getPdfGridData')
    async getPdfGridData(): Promise<CommonResponseModel> {
      try {
        return this.service.getPdfGridData();
      } catch (err) {
        console.log(err);
      }
    }
}
