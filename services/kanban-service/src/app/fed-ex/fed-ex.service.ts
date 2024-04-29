import { Inject, Injectable } from "@nestjs/common";
import axios from "axios";
import { CommonResponseModel } from "libs/shared-models";
// const fs = require('fs');
// import path from 'path';
import { DxmShipmentCreation } from "./entity/shipment-creation.entity";
import { Repository } from "typeorm";
import { appConfig } from "services/kanban-service/src/app/database-connections/config"

import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class FedExService {
    constructor(
      @InjectRepository(DxmShipmentCreation)
      private readonly dxmRepo: Repository<DxmShipmentCreation>
    ) { }

    async createAuthTokenForFedExApi () : Promise<any>{
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        const body = {
            grant_type : appConfig.grant_type,
            client_id : appConfig.client_id,
            client_secret : appConfig.client_secret
        }
        const response = await axios.post(`https://apis.fedex.com/oauth/token`,body ,{headers})
        console.log(response.data.access_token)
        return response.data.access_token;
      }

      async fedExShipmentCreation (dto:any) :Promise<CommonResponseModel>{
         const token = await this.createAuthTokenForFedExApi()
         const headers = {
            'Authorization': `Bearer ${token}`
         }
         const response = await axios.post(`https://apis.fedex.com/ship/v1/shipments`,dto,{headers})
         const convertPdf = await this.covertToPdf(response.data?.output.transactionShipments[0]?.pieceResponses[0]?.packageDocuments[0]?.encodedLabel , response.data?.output.transactionShipments[0]?.masterTrackingNumber)
         console.log(convertPdf.status)
         if(convertPdf.status){
            return new CommonResponseModel(true,1,'AWB Saved Successfully',response.data?.output.transactionShipments[0]?.masterTrackingNumber)
         }else{
          return new CommonResponseModel(false,0,'Something went wrong while generating')
         }
      }

      async covertToPdf(encodeData: string, trackingNum: any): Promise<CommonResponseModel> {
        return new Promise<CommonResponseModel>((resolve, reject) => {
            const pdfBuffer = Buffer.from(encodeData, 'base64');
            const downloadFolder = './awb-files';
            const filePath = path.join(downloadFolder, `AWB${trackingNum}.pdf`);
            fs.writeFile(filePath, pdfBuffer, (err) => {
                if (err) {
                  console.log(err,'-----error and path is',filePath)
                    reject(new CommonResponseModel(false, 0, 'Something went wrong while saving pdf'));
                } else {
                  console.log(filePath,'padf saved')
                    resolve(new CommonResponseModel(true, 1, 'PDF saved'));
                }
            });
        });
      }

      async saveShipmentDetails(req:any):Promise<CommonResponseModel>{
        const obj = new DxmShipmentCreation();
        obj.dxmDate = req.tdate
        obj.dxmInternalNo = req.dxmInternalOrderNo
        obj.dxmOrderNo = req.dxmordno
        obj.invNo = req.invoiceM3
        obj.reqNo = req.sl_NO
        obj.awbNo = req.awbNum
        const save = await this.dxmRepo.save(obj)
        if (save) {
          return new CommonResponseModel(true, 11, 'Data Saved', save);
        } else {
          return new CommonResponseModel(false, 11, 'something went wrong');
        }
      }
      
      async getShippedData():Promise<CommonResponseModel>{
        const data = await this.dxmRepo.find()
        if(data.length){
          return new CommonResponseModel(true, 11, 'Data retrived', data);
        } else {
          return new CommonResponseModel(false, 11, 'No data found');
        }
      }

      // async covertToPdf (encodeData:string , trackingNum:any):Promise<CommonResponseModel>{
      //   const pdfBuffer = Buffer.from(encodeData, 'base64');
      //   const downloadFolder = 'C:/AWB'
      //   const filePath = path.join(downloadFolder, `AWB${trackingNum}.pdf`);
      //   // const filePath = `AWB${trackingNum}.pdf`;
      //   const pdfSave = fs.writeFile(filePath, pdfBuffer, (err) => {
      //     if (err) {
      //       return new CommonResponseModel(false,0,'Something went wrong while saving pdf')
      //    }else{
      //     return new CommonResponseModel(true,1,'PDF saved')
      //    }
      //   });
      //   console.log(pdfSave,'---------')
      //   return
      // }
      
}