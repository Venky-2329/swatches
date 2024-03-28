import { Injectable } from '@nestjs/common';
import { TrimSwatchDto } from './dto/trim-swatch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TrimSwatchEntity } from './entities/trim-swatch.entity';
import { Repository } from 'typeorm';
import { CommonResponseModel, DateReq, StatusEnum, TrimSwatchStatus } from 'libs/shared-models';

@Injectable()
export class TrimSwatchService {

  constructor(
    @InjectRepository(TrimSwatchEntity)
    private readonly repo : Repository<TrimSwatchEntity>
  ){}
  async getMaxId(): Promise<any> {
    const id = await this.repo
        .createQueryBuilder('e')
        .select(`MAX(trim_swatch_id) as trimSwatchId`)
        .orderBy(` created_at`, 'DESC')
        .getRawOne();
    return id;
  }

  async createTrimSwatch(req: TrimSwatchDto):Promise<CommonResponseModel>{
    try {
      console.log(req.supplierId,'-------------------')
      const formattedDate = new Date(req.grnDate).toISOString().slice(0,10)
      const date = new Date(formattedDate)

      const entityData = new TrimSwatchEntity()
      const getId = await this.getMaxId()

      if(getId !== undefined){
        entityData.trimSwatchNumber = "TSW" + '-' + Number(getId.trimSwatchId + 1).toString().padStart(6,'0');
      }

      entityData.buyerId = req.buyerId
      entityData.supplierId = req.supplierId
      entityData.poNumber = req.poNumber
      entityData.itemNo = req.itemNo
      entityData.itemDescription = req.itemDescription
      entityData.invoiceNo = req.invoiceNo
      entityData.styleNo = req.styleNo
      entityData.merchant = req.merchant
      entityData.grnNumber = req.grnNumber
      entityData.grnDate = date
      entityData.status = StatusEnum.SENT_FOR_APPROVAL
      entityData.checkedBy = req.checkedBy
      entityData.approverId = req.approverId
      const saveData = await this.repo.save(entityData)
      return new CommonResponseModel(true , 1 , `${saveData.trimSwatchNumber} created successfully` ,saveData)

    } catch (error) {
      throw (error)
    }
  }

  async updatePath(filePath: string , filename:string , trimSwatchId: number):Promise <CommonResponseModel>{
    try {
      const filePathUpdate = await this.repo.update({trimSwatchId : trimSwatchId} , {filePath: filePath , fileName:filename})
      if (filePathUpdate.affected){
        return new CommonResponseModel(true , 1 ,'Uploaded successfully' , filePath)
      }else{
        return new CommonResponseModel(false, 11, 'uploaded failed', filePath);
      }
    } catch (error) {
      throw (error)
    }
  }

  async getAllTrimSwatchData(req: DateReq):Promise<CommonResponseModel>{
    try {
      const fromDate = req.fromDate;
      const toDate = req.toDate;
      let query = `SELECT ts.buyer_id AS buyerId,b.buyer_name AS buyerName,
      ts.supplier_id AS supplierId,s.supplier_name , ts.trim_swatch_id , ts.trim_swatch_number , ts.po_number , ts.item_no , ts.item_description, 
      ts.invoice_no , ts.style_no ,ts.merchant , ts.grn_number , ts.grn_date , ts.checked_by , ts.file_name , ts.file_path ,ts.status,ts.created_at,ts.rejection_reason 
      FROM trim_swatch ts
      LEFT JOIN buyer b ON b.buyer_id = ts.buyer_id
      LEFT JOIN supplier s ON s.supplier_id = ts.supplier_id
      WHERE 1=1`
      if(req.tabName != undefined){
        if(req.tabName == 'SENT_FOR_APPROVAL'){
          query=query+' and ts.status IN("SENT_FOR_APPROVAL")'
        }
        if(req.tabName == 'APPROVED'){
            query= query+' and ts.status IN("APPROVED")'
        }
        if(req.tabName == 'REJECTED'){
            query= query+' and ts.status IN("REJECTED")'
        }
      }
      if(fromDate){
          query = query +` and DATE(created_at) BETWEEN '${fromDate}' AND '${toDate}'`;
      }
      
      const data = await this.repo.query(query)
      if (data.length>0){
        return new CommonResponseModel(true,1,'Data retrieved successfully',data)
      }else{
        return new CommonResponseModel(false,0,'No data found',[])
      }
    } catch (error) {
      throw(error)
    }
  }

  async statusCount():Promise<CommonResponseModel>{
    try{
        let query = `SELECT
        COALESCE(SUM(CASE WHEN STATUS = 'sent_for_approval' THEN 1 ELSE 0 END),0) AS openCount,
        COALESCE(SUM(CASE WHEN STATUS = 'approved' THEN 1 ELSE 0 END),0) AS approvedCount,
        COALESCE(SUM(CASE WHEN STATUS = 'rejected' THEN 1 ELSE 0 END),0) AS rejectedCount
        FROM trim_swatch`
        const result = await this.repo.query(query)
        if (result.length) {
            return new CommonResponseModel(true, 1, 'Data retrieved successfully', result);
          } else {
            return new CommonResponseModel(false, 0, 'No data found', []);
          }
    }catch(err){
        throw(err)
    }
}

async updateApprovedStatus(req: TrimSwatchStatus): Promise<CommonResponseModel> {
  try {
    console.log(req,'service')
      const checkInData = await this.repo.findOne({ where: { trimSwatchId : req.trimSwatchId } });

      if (!checkInData) {
          throw new Error(' Trim data not found');
      }

      checkInData.status = StatusEnum.APPROVED;
      checkInData.trimSwatchNumber = req.trimSwatchNumber;
      await this.repo.save(checkInData);
      return new CommonResponseModel(true, 1, 'Approved successfully', checkInData);
  } catch (err) {
      throw err;
  }
}

async updateRejectedStatus(req: TrimSwatchStatus): Promise<CommonResponseModel> {
  try {
      const rejectedData = await this.repo.findOne({ where: { trimSwatchId : req.trimSwatchId } });

      if (!rejectedData) {
          throw new Error('Trim data not found');
      }

      rejectedData.status = StatusEnum.REJECTED;
      rejectedData.rejectionReason = req.rejectionReason;
      await this.repo.save(rejectedData);
      return new CommonResponseModel(true, 1, 'Rejected successfully', rejectedData);
  } catch (err) {
      throw err;
  }
}

async getDataById(req:TrimSwatchStatus):Promise<CommonResponseModel>{
  try{
    console.log(req,'.........')
    let query = `SELECT ts.trim_swatch_id , ts.trim_swatch_number ts.buyer_id AS buyerId,b.buyer_name AS buyerName,
      ts.supplier_id AS supplierId,s.supplier_name , ts.trim_swatch_id , ts.trim_swatch_number , ts.po_number , ts.item_no , ts.item_description, 
      ts.invoice_no , ts.style_no ,ts.merchant , ts.grn_number , ts.grn_date , ts.checked_by , ts.file_name , ts.file_path ,ts.status,ts.created_at,ts.rejection_reason 
      FROM trim_swatch ts
      LEFT JOIN buyer b ON b.buyer_id = ts.buyer_id
      LEFT JOIN supplier s ON s.supplier_id = ts.supplier_id
      WHERE 1=1`
    if(req.trimSwatchId){
        query = query +` and fs.trim_swatch_id = ${req.trimSwatchId}`;
    }

    const data = await this.repo.query(query)

    if(data.length>0){
      return new CommonResponseModel(true,1,'Data retrieved successfully',data)
    }else{
      return new CommonResponseModel(false,0,'No data found',[])
    }
  }catch(err){
    throw(err)
  }
}

}
