import { Injectable } from "@nestjs/common";
import { CommonResponseModel, DateReq, ReworkStatus, StatusEnum, SwatchStatus } from "libs/shared-models";
import { FabricSwatchDto } from "./dtos/fabric-swatch-dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { FabricSwatchEntity } from "./entities/fabric-swatch-entity";
import { FabricUploadEntity } from "./entities/fabric-swatch-upload-entity";
import { FabricItemEntity } from "./entities/fabric-item.entity";
import axios from "axios";
import * as XLSX from 'xlsx';
import { GenericTransactionManager } from "../../database-connections/type0rem-transactions.ts/genertic-transaction";
import { Cron } from '@nestjs/schedule';
import { ItemExcelEntity } from "./entities/item-excel.entity";
const path = require('path');
const fs = require('fs');
@Injectable()
export class FabricSwatchService{
    constructor(
      @InjectRepository(FabricSwatchEntity)
      private readonly repo: Repository<FabricSwatchEntity>,
      private readonly dataSource: DataSource,
      @InjectRepository(FabricUploadEntity)
      private readonly uploadRepo: Repository<FabricUploadEntity>,
      @InjectRepository(ItemExcelEntity)
      private readonly iemExcelRepo: Repository<ItemExcelEntity>
    ){}

    async getMaxId(): Promise<any> {
      const id = await this.repo

          .createQueryBuilder('e')
          .select(`MAX(fabric_swatch_id) as fabricSwatchId`)
          .orderBy(` created_at`, 'DESC')
          .getRawOne();
      return id;
    }


    async createFabricSwatch(req: FabricSwatchDto): Promise<CommonResponseModel>{
        try{
            const formattedDate = new Date(req.grnDate).toISOString().slice(0, 10)
            const date = new Date(formattedDate)

            const entityData = new FabricSwatchEntity()
            const getId = await this.getMaxId()

            if (getId !== undefined) {
                entityData.fabricSwatchNumber = "FSW" + '-' + Number(getId.fabricSwatchId + 1).toString().padStart(6, '0');
            }

            entityData.buyerId = req.buyerId
            entityData.brandId = req.brandId
            entityData.styleNo = req.styleNo
            // entityData.itemNo = req.itemNo
            // entityData.itemDescription = req.itemDescription
            entityData.categoryType = req.categoryType
            entityData.categoryId = req.categoryId
            entityData.seasonId = req.seasonId
            entityData.color = req.color
            entityData.poNumber = req.poNumber
            entityData.grnNumber = req.grnNumber
            entityData.grnDate = date
            entityData.status = StatusEnum.SENT_FOR_APPROVAL
            entityData.approverId = req.approverId
            entityData.createdUser = req.createdUser
            entityData.createdUserMail = req.createdUserMail
            entityData.rework = ReworkStatus.NO
            entityData.remarks = req.remarks
            entityData.supplierId = req.supplierId
            const entities=[]
            for(const rec of req.itemInfo){
              const entity = new FabricItemEntity()
              entity.itemNo = rec.itemNo
              entity.itemDescription = rec.itemDescription
              const fabEntity = new FabricSwatchEntity()
              fabEntity.fabricSwatchId = rec.fabricSwatchId
              entity.fabInfo = fabEntity
              entities.push(entity)
            }
            entityData.itemInfo = entities
            const saveData = await this.repo.save(entityData)
            return new CommonResponseModel(true,1,`${saveData.fabricSwatchNumber} created successfully`,saveData)
        }catch(err){
            throw(err)
        }
    }

    
    async updatePath(filePath: any, fabricSwatchId: number): Promise<CommonResponseModel> {
      try {
        console.log(filePath,'zxcvbnm,jhgfdghiop')
        let flag = true;
        const entities=[]
        for (const res of filePath) {
          const entity = new FabricUploadEntity()
          entity.fileName = res.filename
          entity.filePath = res.path
          const fabEntity = new FabricSwatchEntity()
          fabEntity.fabricSwatchId = fabricSwatchId
          entity.fabInfo = fabEntity
          entities.push(entity);
        }
        const uploadDoc = await this.uploadRepo.save(entities);
        if (!uploadDoc) {
          flag = false;
        }
        if (flag) {
          return new CommonResponseModel(true, 11, 'uploaded successfully', filePath);
        }
        else {
          return new CommonResponseModel(false, 11, 'uploaded failed', filePath);
        }
      }
      catch (error) {
        console.log(error);
      }
    }

    // async updatePath(filePath: string,filename: string,fabricSwatchId: number): Promise<CommonResponseModel> {
    //     try {
    //       const filePathUpdate = await this.repo.update({ fabricSwatchId: fabricSwatchId },{ filePath: filePath, fileName: filename });
    //     //   const result = await this.repo.findOne({where: { fabricSwatchId: fabricSwatchId } });
    //       if (filePathUpdate.affected > 0) {
    //         return new CommonResponseModel(true,11,'uploaded successfully',filePath);
    //       } else {
    //         return new CommonResponseModel(false, 11, 'uploaded failed', filePath);
    //       }
    //     } catch (error) {}
    // }

    async getAllFabricSwatchData(req: DateReq):Promise<CommonResponseModel>{
      try{
        const fromDate = req.fromDate;
        const toDate = req.toDate;
        let query = `SELECT fs.fabric_swatch_id AS fabricSwatchId,fs.fabric_swatch_number AS fabricSwatchNo, fs.style_no styleNo,fs.item_no AS itemNo,fs.category_type AS categoryType,fs.color,fs.po_number AS poNumber,
        fs.grn_number AS grnNumber,fs.item_description AS itemDescription,fs.status,fs.approver_id AS approverId,spu.email_id AS approverMail,
        fs.buyer_id AS buyerId,b.buyer_name AS buyerName,
        fs.supplier_id AS supplierId , s.supplier_name AS supplierName,
        fs.brand_id AS brandId,sbm.brand_name AS brandName,
        fs.category_id AS categoryId,scm.category_name AS categoryName,
        fs.season_id AS seasonId,ssm.season_name AS seasonName,
        fs.grn_date as grnDate,fs.rejection_reason as rejectionReason,fue.file_name as fileName,
        fue.file_path as filePath,fs.created_at as createdAt, fs.created_user as createdUser,
        fs.created_user_mail as createdUserMail,fs.rework,fs.rework_remarks as reworkRemarks,fs.approval_remarks as approvalRemarks,fs.remarks
        FROM fabric_swatch fs
        LEFT JOIN swatch_buyer b ON b.buyer_id = fs.buyer_id
        LEFT JOIN swatch_supplier s ON s.supplier_id = fs.supplier_id
        LEFT JOIN swatch_brands sbm ON sbm.brand_id = fs.brand_id
        LEFT JOIN swatch_category scm ON scm.category_id = fs.category_id
        LEFT JOIN swatch_seasons ssm ON ssm.season_id = fs.season_id
        LEFT JOIN swatch_approval_users spu ON spu.approved_id = fs.approver_id
        LEFT JOIN fabric_upload_entity fue ON fue.fabric_swatch_id = fs.fabric_swatch_id
        WHERE 1=1`
        if(req.tabName != undefined){
          if(req.tabName == 'SENT_FOR_APPROVAL'){
              query=query+' and fs.status IN("SENT_FOR_APPROVAL")'
          }
          if(req.tabName == 'APPROVED'){
              query= query+' and fs.status IN("APPROVED")'
          }
          if(req.tabName == 'REJECTED'){
              query= query+' and fs.status IN("REJECTED")'
          }
          if(req.tabName == 'REWORK'){
              query= query+' and fs.status IN("REWORK")'
          }
        }
        if(fromDate){
            query = query +` and DATE(created_at) BETWEEN '${fromDate}' AND '${toDate}'`;
        }
        if(req.buyerId != undefined){
          query = query + ` and fs.buyer_id = ${req.buyerId}`
        }
        if(req.supplierId != undefined){
          query = query + ` and fs.supplier_id = ${req.supplierId}`
        }
        if(req.brandId != undefined){
          query = query + ` and fs.brand_id = ${req.brandId}`
        }
        if(req.swatchNo != undefined){
          query = query + ` and fs.fabric_swatch_number = '${req.swatchNo}'`
        }
        if(req.createdBy != undefined){
          query = query + ` and fs.created_user = ${req.createdBy}`
        }
        if(req.status != undefined){
          query = query + ` and fs.status = '${req.status}'`
        }
        query = query + ` GROUP BY fs.fabric_swatch_number ORDER BY fs.fabric_swatch_number DESC`

        const data = await this.dataSource.query(query)

        if(data.length>0){
          return new CommonResponseModel(true,1,'Data retrieved successfully',data)
        }else{
          return new CommonResponseModel(false,0,'No data found',[])
        }
      }catch(err){
        throw(err)
      }
    }

    async statusCount():Promise<CommonResponseModel>{
      try{
          let query = `SELECT
          COALESCE(SUM(CASE WHEN STATUS = 'sent_for_approval' THEN 1 ELSE 0 END),0) AS waitingCount,
          COALESCE(SUM(CASE WHEN STATUS = 'approved' THEN 1 ELSE 0 END),0) AS approvedCount,
          COALESCE(SUM(CASE WHEN STATUS = 'rejected' THEN 1 ELSE 0 END),0) AS rejectedCount,
          COALESCE(SUM(CASE WHEN STATUS = 'rework' THEN 1 ELSE 0 END),0) AS reworkCount
          FROM fabric_swatch`
          const result = await this.dataSource.query(query)
          if (result.length) {
              return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
            } else {
              return new CommonResponseModel(false, 0, 'No data found', []);
            }
      }catch(err){
          throw(err)
      }
  }

  async updateApprovedStatus(req: SwatchStatus): Promise<CommonResponseModel> {
    try {
      console.log(req,'service')
        const checkInData = await this.repo.findOne({ where: { fabricSwatchId : req.fabricSwatchId } });

        if (!checkInData) {
            throw new Error('Swatch data not found');
        }

        checkInData.status = StatusEnum.APPROVED;
        checkInData.fabricSwatchNumber = req.fabricSwatchNumber;
        checkInData.approvalRemarks = req.approvalRemarks
        await this.repo.save(checkInData);
        return new CommonResponseModel(true, 1, 'Approved successfully', checkInData);
    } catch (err) {
        throw err;
    }
}

async updateRejectedStatus(req: SwatchStatus): Promise<CommonResponseModel> {
    try {
        const rejectedData = await this.repo.findOne({ where: { fabricSwatchId : req.fabricSwatchId } });

        if (!rejectedData) {
            throw new Error('Swatch data not found');
        }

        rejectedData.status = StatusEnum.REJECTED;
        rejectedData.rejectionReason = req.rejectionReason;
        await this.repo.save(rejectedData);
        return new CommonResponseModel(true, 1, 'Rejected successfully', rejectedData);
    } catch (err) {
        throw err;
    }
}

async updateReworkStatus(req: SwatchStatus): Promise<CommonResponseModel> {
    try {
        const reworkData = await this.repo.findOne({ where: { fabricSwatchId : req.fabricSwatchId } });

        if (!reworkData) {
            throw new Error('Swatch data not found');
        }

        reworkData.status = StatusEnum.REWORK;
        reworkData.rework = ReworkStatus.YES
        reworkData.reworkRemarks = req.reworkRemarks;
        await this.repo.save(reworkData);
        return new CommonResponseModel(true, 1, 'Sent for Rework', reworkData);
    } catch (err) {
        throw err;
    }
}

async updateSentForApprovalStatus(req: SwatchStatus): Promise<CommonResponseModel> {
    try {
        const mainData = await this.repo.findOne({ where: { fabricSwatchId : req.fabricSwatchId } });

        if (!mainData) {
            throw new Error('Swatch data not found');
        }
        mainData.status = StatusEnum.SENT_FOR_APPROVAL;
        mainData.remarks = req.remarks;
        await this.repo.save(mainData);
        return new CommonResponseModel(true, 1, 'Sent for Approval', mainData);
    } catch (err) {
        throw err;
    }
}

async getDataById(req:SwatchStatus):Promise<CommonResponseModel>{
  try{
    let query = `SELECT fs.fabric_swatch_id AS fabricSwatchId,fs.fabric_swatch_number AS fabricSwatchNo, fs.style_no styleNo,fs.item_no AS itemNo,fs.category_type AS categoryType,fs.color,fs.po_number AS poNumber,
    fs.grn_number AS grnNumber,fs.item_description AS itemDescription,fs.status,fs.approver_id AS approverId,spu.email_id AS approverMail,
    fs.buyer_id AS buyerId,b.buyer_name AS buyerName,
    fs.supplier_id AS supplierId , s.supplier_name AS supplierName,
    fs.brand_id AS brandId,sbm.brand_name AS brandName,
    fs.category_id AS categoryId,scm.category_name AS categoryName,
    fs.season_id AS seasonId,ssm.season_name AS seasonName,
    fs.grn_date as grnDate,fs.rejection_reason as rejectionReason,fue.file_name as fileName, 
    fue.file_path as filePath,fs.created_at as createdAt, fs.created_user as createdUser,
    fs.created_user_mail as createdUserMail,fs.rework,fs.rework_remarks as reworkRemarks,fs.approval_remarks as approvalRemarks,fs.remarks,fue.upload_id as uploadId
    FROM fabric_swatch fs
    LEFT JOIN swatch_buyer b ON b.buyer_id = fs.buyer_id
    LEFT JOIN swatch_supplier s ON s.supplier_id = fs.supplier_id
    LEFT JOIN swatch_brands sbm ON sbm.brand_id = fs.brand_id
    LEFT JOIN swatch_category scm ON scm.category_id = fs.category_id
    LEFT JOIN swatch_seasons ssm ON ssm.season_id = fs.season_id
    LEFT JOIN swatch_approval_users spu ON spu.approved_id = fs.approver_id
    LEFT JOIN fabric_upload_entity fue ON fue.fabric_swatch_id = fs.fabric_swatch_id
    WHERE 1=1`
    if(req.fabricSwatchId){
        query = query +` and fs.fabric_swatch_id = ${req.fabricSwatchId}`;
    }

    const data = await this.dataSource.query(query)

    if(data.length>0){
      return new CommonResponseModel(true,1,'Data retrieved successfully',data)
    }else{
      return new CommonResponseModel(false,0,'No data found',[])
    }
  }catch(err){
    throw(err)
  }
}


  async getAllFabricBuyers():Promise<CommonResponseModel>{
    try{
      let query =`SELECT fs.buyer_id,sb.buyer_name AS buyerName
      FROM fabric_swatch fs
      LEFT JOIN swatch_buyer sb ON sb.buyer_id = fs.buyer_id
      GROUP BY sb.buyer_name`
      const data = await this.dataSource.query(query)

      if(data.length > 0){
        return new CommonResponseModel(true, 1, 'Data retrieved successfully', [data])
      }else{
        return new CommonResponseModel(false, 2, 'No data found',[])
      }
    }catch(err){
      throw(err)
    }
  }

  async getAllBrands():Promise<CommonResponseModel>{
    try{
      let query =`SELECT fs.brand_id,sb.brand_name AS brandName
      FROM fabric_swatch fs
      LEFT JOIN swatch_brands sb ON sb.brand_id = fs.brand_id
      GROUP BY sb.brand_name`
      const data = await this.dataSource.query(query)

      if(data.length > 0){
        return new CommonResponseModel(true, 1, 'Data retrieved successfully', [data])
      }else{
        return new CommonResponseModel(false, 2, 'No data found',[])
      }
    }catch(err){
      throw(err)
    }
  }

  async getAllCreatedBy():Promise<CommonResponseModel>{
    try{
      let query =`SELECT fs.created_user AS createdBy FROM fabric_swatch fs GROUP BY fs.created_user`
      const data = await this.dataSource.query(query)

      if(data.length > 0){
        return new CommonResponseModel(true, 1, 'Data retrieved successfully', [data])
      }else{
        return new CommonResponseModel(false, 2, 'No data found',[])
      }
    }catch(err){
      throw(err)
    }
  }

  async deleteImage(req: SwatchStatus): Promise<CommonResponseModel> {
    try {
      const dataToDelete = await this.uploadRepo.findOne({where:{uploadId: req.fabricSwatchId}});
      if (!dataToDelete) {
        return new CommonResponseModel(false, 0, 'Data not found');
      }
      
      await this.uploadRepo.remove(dataToDelete);
      return new CommonResponseModel(true, 1, 'Data deleted successfully');
    } catch (error) {
      return new CommonResponseModel(false, 0, 'Something went wrong');
    }
  }


  async reportExcelData(): Promise<void> {
    const downloadsPath = path.resolve('C:/Users/venka/Downloads');
  
    // Step 1: Get all files in the Downloads directory
    const files = fs.readdirSync(downloadsPath);
  
    // Step 2: Filter files that match the "ItemResponsibleReport" pattern
    const reportFiles = files.filter(file => file.startsWith('ItemResponsibleReport') && file.endsWith('.xls'));
  
    if (reportFiles.length === 0) {
      throw new Error('No ItemResponsibleReport files found in the Downloads directory.');
    }
  
    // Step 3: Sort the files based on the numerical suffix
    reportFiles.sort((a, b) => {
      const aMatch = a.match(/ItemResponsibleReport(?: \((\d+)\))?\.xls/);
      const bMatch = b.match(/ItemResponsibleReport(?: \((\d+)\))?\.xls/);
  
      const aNum = aMatch && aMatch[1] ? parseInt(aMatch[1], 10) : 0;
      const bNum = bMatch && bMatch[1] ? parseInt(bMatch[1], 10) : 0;
  
      return bNum - aNum;
    });
  
    // Step 4: Pick the latest file
    const latestReportFile = reportFiles[0];
    const filePath = path.join(downloadsPath, latestReportFile);
    console.log(filePath, '-----------');
    
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        throw new Error('Worksheet not found in the Excel file.');
      }
    
      const entitiesToSave: ItemExcelEntity[] = [];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
      // Step 5: Fetch existing invoice numbers from the database
      const existingInvoices = await this.iemExcelRepo.find({
        select: ['itemCode'],
      });
      const existingInvoicePOCombinations = new Set(existingInvoices.map(inv => `${inv.itemCode}`));
    
      rows.forEach((row, rowNumber) => {
        if (rowNumber > 3) {
          const cell6 = row[6];
          const itemCode = cell6 ? cell6.toString(): ''
          const cell7 = row[7];
          const itemDesc = cell7 ? cell7.toString(): ''

          const cell11 = row[11];
          const approver = cell11 ? cell11.toString(): ''

          const cell16 = row[16];
          const brand = cell16 ? cell16.toString(): ''
          const cell17 = row[17];
          const buyerCode = cell17 ? cell17.toString(): ''
          const cell18 = row[18];
          const buyerName = cell18 ? cell18.toString(): ''
    
          // Step 6: Check if the invoice number and PO number combination already exists
          // if (!existingInvoicePOCombinations.has(`${invoiceNo}-${poNumber}`)) {
            if (!existingInvoicePOCombinations.has(itemCode)) {
            const entity = new ItemExcelEntity();
            entity.itemCode = itemCode
            entity.itemDescription = itemDesc
            entity.buyerName = buyerName
            entity.buyerCode = buyerCode
            entity.approver = approver
            entity.brand = brand
            entitiesToSave.push(entity);
    
            // Add to the set to prevent duplicates within the same file
            // existingInvoicePOCombinations.add(`${invoiceNo}-${poNumber}`);
            existingInvoicePOCombinations.add(itemCode);
          }
        }
      });
    
      // Step 7: Save only unique invoice numbers
      if (entitiesToSave.length > 0) {
        await this.iemExcelRepo.save(entitiesToSave);
      }
  }
  
}