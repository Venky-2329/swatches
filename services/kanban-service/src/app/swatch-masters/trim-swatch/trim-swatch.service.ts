import { Injectable } from '@nestjs/common';
import { TrimSwatchDto } from './dto/trim-swatch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TrimSwatchEntity } from './entities/trim-swatch.entity';
import { DataSource, Repository } from 'typeorm';
import { CommonResponseModel, DateReq, StatusEnum, TrimSwatchStatus } from 'libs/shared-models';

@Injectable()
export class TrimSwatchService {

  constructor(
    @InjectRepository(TrimSwatchEntity)
    private readonly repo : Repository<TrimSwatchEntity>,
    private readonly dataSource : DataSource
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
      entityData.grnNumber = req.grnNumber
      entityData.grnDate = date
      entityData.status = StatusEnum.SENT_FOR_APPROVAL
      entityData.approverId = req.approverId
      entityData.createdUser = req.createdUser
      entityData.createdUserMail = req.createdUserMail
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
      ts.invoice_no , ts.style_no , ts.grn_number , ts.grn_date , ts.file_name , ts.file_path ,ts.status,ts.created_at as createdAt ,ts.rejection_reason,ts.created_user as createdUser,ts.created_user_mail as createdUserMail
      FROM trim_swatch ts
      LEFT JOIN swatch_buyer b ON b.buyer_id = ts.buyer_id
      LEFT JOIN swatch_supplier s ON s.supplier_id = ts.supplier_id
      WHERE 1=1 `
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
        if(req.tabName == 'REWORK'){
            query= query+' and ts.status IN("REWORK")'
        }
      }
      if(fromDate){
          query = query +` and DATE(createdAt) BETWEEN '${fromDate}' AND '${toDate}'`;
      }

      if (req.swatchNo !== undefined){
        query = query + ` and ts.trim_swatch_number = '${req.swatchNo}'`
      }
      
      if(req.buyerId != undefined ){
        query = query + ` and ts.buyer_id  = ${req.buyerId}`
      }
      if(req.grnNo != undefined ){
        query = query + ` and ts.grn_number  = '${req.grnNo}'`
      }
      if(req.supplierId != undefined ){
        query = query + ` and ts.supplier_id  = ${req.supplierId}`
      }
      if(req.styleNo != undefined ){
        query = query + ` and ts.style_no  = '${req.styleNo}'`
      }
      if(req.itemNo != undefined ){
        query = query + ` and ts.item_no  = '${req.itemNo}'`
      }
      if(req.approverId != undefined ){
        query = query + ` and ts.approver_id = ${req.approverId}`
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
        COALESCE(SUM(CASE WHEN STATUS = 'rejected' THEN 1 ELSE 0 END),0) AS rejectedCount,
        COALESCE(SUM(CASE WHEN STATUS = 'rework' THEN 1 ELSE 0 END),0) AS reworkCount
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
    let query = `SELECT ts.trim_swatch_id , ts.trim_swatch_number ,ts.buyer_id AS buyerId,b.buyer_name AS buyerName,
      ts.supplier_id AS supplierId,s.supplier_name , ts.trim_swatch_id , ts.trim_swatch_number , ts.po_number , ts.item_no , ts.item_description, 
      ts.invoice_no , ts.style_no , ts.grn_number , ts.grn_date , ts.file_name , ts.file_path ,ts.status,ts.created_at as createdAt,ts.rejection_reason , ts.created_user as createdUser,ts.created_user_mail as createdUserMail
      FROM trim_swatch ts
      LEFT JOIN swatch_buyer b ON b.buyer_id = ts.buyer_id
      LEFT JOIN swatch_supplier s ON s.supplier_id = ts.supplier_id
      `
    if(req.trimSwatchId){
        query = query +`WHERE ts.trim_swatch_id = ${req.trimSwatchId}`;
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

  async getGrnNo():Promise<CommonResponseModel>{
    let query = ` SELECT grn_number AS grnNo
    FROM trim_swatch
    GROUP BY grn_number`
    const data = await this.dataSource.query(query)

    if(data.length > 0){
      return new CommonResponseModel(true, 1, 'Data retrieved', data)
    }else{
      return new CommonResponseModel(false,0,'No data',[])
    }
  }

  async getPoNo():Promise<CommonResponseModel>{
    let query = `SELECT po_number AS PoNo
    FROM trim_swatch
    WHERE po_number IS NOT NULL
    GROUP BY po_number`
    const data = await this.dataSource.query(query)

    if(data.length>0){
      return new CommonResponseModel(true, 1, 'Data retrieved', data)
    }else{
      return new CommonResponseModel(false,0,'No data',[])
    }
  }

  async getStyleNo():Promise<CommonResponseModel>{
    let query = ` SELECT style_no AS styleNo
    FROM trim_swatch
    WHERE style_no IS NOT NULL
    GROUP BY style_no`
    const data = await this.dataSource.query(query)

    if(data.length>0){
      return new CommonResponseModel(true , 1 ,'Data retrieved',data)
    }else{
      return new CommonResponseModel(false ,0 , 'No Data',[])
    }
  }

  async getItemNo():Promise<CommonResponseModel>{
    let query = `  SELECT item_no AS itemNo
    FROM trim_swatch
    GROUP BY item_no`
    const data = await this.dataSource.query(query)

    if(data.length>0){
      return new CommonResponseModel(true , 1 ,'Data retrieved',data)
    }else{
      return new CommonResponseModel(false ,0 , 'No Data',[])
    }
  }

  async getSwatchNo():Promise<CommonResponseModel>{
    let query = `SELECT trim_swatch_number AS trimSwatchNumber
    FROM trim_swatch
    GROUP BY trim_swatch_number`
    const data = await this.dataSource.query(query)


    if(data.length>0){
      return new CommonResponseModel(true , 1 ,'Data retrieved',data)
    }else{
      return new CommonResponseModel(false ,0 , 'No Data',[])
    }
  }

  async updateReworkStatus(req: TrimSwatchStatus): Promise<CommonResponseModel> {
    try {
        const reworkedData = await this.repo.findOne({ where: { trimSwatchId : req.trimSwatchId } });
  
        if (!reworkedData) {
            throw new Error('Trim data not found');
        }
  
        reworkedData.status = StatusEnum.REWORK;
        reworkedData.reworkReason = req.reworkReason;
        await this.repo.save(reworkedData);
        return new CommonResponseModel(true, 1, 'Rework done successfully', reworkedData);
    } catch (err) {
        throw err;
    }
  }


}
