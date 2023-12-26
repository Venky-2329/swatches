import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CommonResponseModel } from "libs/shared-models";
import { SampleUploadService } from "./sample-upload.service";
import { ApiConsumes } from "@nestjs/swagger";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('sample-upload')
export class SampleUploadController {
  constructor(private readonly service: SampleUploadService) {}

  @Post('/create')
  async create(@Body() req:any): Promise<CommonResponseModel> {
    try {
      return this.service.create(req);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('/photoUpload')
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
      if (!file.originalname.match(/\.(png|jpeg|PNG|jpg|JPG)$/)) {
        return callback(new Error('Only png,jpeg,PNG,jpg,JPG files are allowed!'), false);
      }
      callback(null, true);
    },
  }))

  async photoUpload(@UploadedFile() file, @Body() uploadData: any): Promise<CommonResponseModel> {
    try {
      return await this.service.updatePath(file.path,file.filename, uploadData.id)
    } catch (error) { 
        console.log(error)
    }
  }

  @Post('/getData')
  async getData(@Body() req:any): Promise<CommonResponseModel> {
    try {
      return this.service.getData(req);
    } catch (err) {
      console.log(err);
    }
  }
  @Post('/deleteUploadFile')
  async deleteUploadFile(@Body() req:any): Promise<CommonResponseModel> {
    try {
      return this.service.deleteUploadFile(req);
    } catch (err) {
      console.log(err);
    }
  }


  // @Post('/photoUpload')
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('file', {
  //   limits: { files: 1 },
  //   storage: diskStorage({
  //     destination: './upload-files',
  //     filename: (req, file, callback) => {
  //       const name = file.originalname.split('.')[0];
  //       const fileExtName = extname(file.originalname);
  //       const randomName = Array(4)
  //         .fill(null)
  //         .map(() => Math.round(Math.random() * 16).toString(16))
  //         .join('');
  //       callback(null, `${name}-${randomName}${fileExtName}`);
  //     },
  //   }),
  //   fileFilter: (req, file, callback) => {
  //     if (!file.originalname.match(/\.(png|jpeg|PNG|jpg|JPG)$/)) {
  //       return callback(new Error('Only png, jpeg, PNG, jpg, JPG files are allowed!'), false);
  //     }
  //     callback(null, true);
  //   },
  // }))

  // async photoUpload(@UploadedFile() file, @Body() uploadData: any): Promise<CommonResponseModel> {
  //   try {
  //     // Check if file buffer exists and is not empty
  //     if (!file || !file.buffer || file.buffer.length === 0) {
  //       console.error('Invalid file buffer:', file);
  //       throw new Error('Invalid file buffer');
  //     }
  
  //     // Convert the file buffer to a readable stream
  //     const readableStream = new Readable();
  //     readableStream.push(file.buffer);
  //     readableStream.push(null);
  
  //     // Compress the image before saving
  //     const compressedImageBuffer = await sharp(readableStream)
  //       .jpeg({ quality: 80 }) // You can adjust the quality as needed
  //       .toBuffer();
  
  //     // Save the compressed image with the original filename
  //     const compressedFileName = `compressed-${file.originalname}`;
  //     fs.writeFileSync(`./upload-files/${compressedFileName}`, compressedImageBuffer);
  
  //     // Call your service method to update the path with the compressed file
  //     return await this.service.updatePath(`./upload-files/${compressedFileName}`, compressedFileName, uploadData.id);
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error('Failed to upload and compress the image');
  //   }
  // }
  
  
}