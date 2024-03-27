import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FabricSwatchService } from "./fabric-swatch.service";
import { CommonResponseModel, DateReq, SwatchStatus } from "libs/shared-models";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { extname } from "path";
import { diskStorage } from 'multer';
import { FabricSwatchDto } from "./fabric-swatch-dto";
import { ApplicationExceptionHandler } from "libs/backend-utils";
import { MailerService } from "./send-mail";



@Controller('fabric-swatch')
export class FabricSwatchController{
    constructor(
        private readonly service: FabricSwatchService,
        private readonly appHandler: ApplicationExceptionHandler,
        private readonly mailService : MailerService

    ){}
    
    @Post('/createFabricSwatch')
    @ApiBody({type: FabricSwatchDto})
    async createFabricSwatch(@Body() req:any): Promise<CommonResponseModel> {
      try {
        return this.service.createFabricSwatch(req);
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

    @Post('/getAllFabricSwatchData')
    @ApiBody({type:DateReq})
    async getAllFabricSwatchData(@Body() req: any): Promise<CommonResponseModel> {
      try {
        return this.service.getAllFabricSwatchData(req);
      } catch (err) {
        console.log(err);
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
    @ApiBody({type: SwatchStatus})
    async updateApprovedStatus(@Body() req: any): Promise<CommonResponseModel>{
        try{
          console.log(req,'...............controller................')
            return await this.service.updateApprovedStatus(req)
        }catch(err){
            return this.appHandler.returnException(CommonResponseModel,err)
        }
    }

    @Post('/updateRejectedStatus')
    @ApiBody({type: SwatchStatus})
    async updateRejectedStatus(@Body() req: any): Promise<CommonResponseModel>{
        try{
            return await this.service.updateRejectedStatus(req)
        }catch(err){
            return this.appHandler.returnException(CommonResponseModel,err)
        }
    }

    @Post('/getDataById')
    @ApiBody({type: SwatchStatus})
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