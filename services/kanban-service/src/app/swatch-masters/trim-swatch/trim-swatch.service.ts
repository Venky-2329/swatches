import { Injectable } from '@nestjs/common';
import { TrimSwatchDto } from './dto/trim-swatch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TrimSwatchEntity } from './entities/trim-swatch.entity';
import { DataSource, Repository } from 'typeorm';
import { CommonResponseModel, DateReq, ReportReq, ReworkStatus, StatusEnum, TrimSwatchStatus } from 'libs/shared-models';
import { TrimUploadEntity } from './entities/trim-swatch-upload-entity';

@Injectable()
export class TrimSwatchService {

  constructor(
    @InjectRepository(TrimSwatchEntity)
    private readonly repo : Repository<TrimSwatchEntity>,
    private readonly dataSource : DataSource,
    @InjectRepository(TrimUploadEntity)
    private readonly updateRepo : Repository<TrimUploadEntity>
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
      console.log("TSW" + '-' + Number(getId.trimSwatchId + 1).toString().padStart(6,'0'),'===========================================================')
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
      entityData.remarks = req.remarks
      entityData.rework = ReworkStatus.NO
      const saveData = await this.repo.save(entityData)
      return new CommonResponseModel(true , 1 , `${saveData.trimSwatchNumber} created successfully` ,saveData)

    } catch (error) {
      throw (error)
    }
  }

  async updatePath(filePath: any, trimSwatchId: number): Promise<CommonResponseModel> {
    try {
      console.log(filePath,'$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
      let flag = true;
      const entities=[]
      for (const res of filePath) {
        console.log('looppppppppp')
        const entity = new TrimUploadEntity()
        entity.fileName = res.filename
        entity.filePath = res.path
        const trimEntity = new TrimSwatchEntity()
        trimEntity.trimSwatchId = trimSwatchId
        entity.trimInfo = trimEntity
        entities.push(entity);
      }
      const uploadDoc = await this.updateRepo.save(entities);
      if (!uploadDoc) {
        flag = false;
      }
      if (flag) {
        console.log('successsssssssssssssssssssssss')
        return new CommonResponseModel(true, 11, 'uploaded successfully', filePath);
      }
      else {
        console.log('failedddddddddddddddddddddddd')
        return new CommonResponseModel(false, 11, 'uploaded failed', filePath);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // async updatePath(filePath: string , filename:string , trimSwatchId: number):Promise <CommonResponseModel>{
  //   try {
  //     const filePathUpdate = await this.repo.update({trimSwatchId : trimSwatchId} , {filePath: filePath , fileName:filename})
  //     if (filePathUpdate.affected){
  //       return new CommonResponseModel(true , 1 ,'Uploaded successfully' , filePath)
  //     }else{
  //       return new CommonResponseModel(false, 11, 'uploaded failed', filePath);
  //     }
  //   } catch (error) {
  //     throw (error)
  //   }
  // }

  async getAllTrimSwatchData(req: DateReq):Promise<CommonResponseModel>{
    try {
      const fromDate = req.fromDate;
      const toDate = req.toDate;
      let query = `SELECT ts.buyer_id AS buyerId,b.buyer_name AS buyerName,
      ts.supplier_id AS supplierId,s.supplier_name , ts.trim_swatch_id , ts.trim_swatch_number , ts.po_number , ts.item_no , ts.item_description, 
      ts.invoice_no , ts.style_no , ts.grn_number , ts.grn_date , ts.file_name , ts.file_path ,ts.status,ts.created_at as createdAt ,ts.rejection_reason ,ts.rework_reason as reworkReason , ts.approval_reason as approvalReason,ts.created_user as createdUser,ts.created_user_mail as createdUserMail,ts.remarks,
      ts.approver_id AS approvedId , sau.email_id AS emailId,ts.rework, se.employee_id AS employeeId , se.employee_name AS employeeName,ts.updated_at AS updatedAt
      FROM trim_swatch ts
      LEFT JOIN swatch_buyer b ON b.buyer_id = ts.buyer_id
      LEFT JOIN swatch_supplier s ON s.supplier_id = ts.supplier_id
      LEFT JOIN swatch_approval_users sau ON sau.approved_id = ts.approver_id
      LEFT JOIN swatch_employees se ON se.employee_id = sau.user_id
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
          query = query +` and DATE(ts.created_at) BETWEEN '${fromDate}' AND '${toDate}'`;
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
      query = query + `ORDER BY ts.trim_swatch_number DESC`

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
      checkInData.approvalReason = req.approvalRemarks;
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
      ts.invoice_no , ts.style_no , ts.grn_number , ts.grn_date , ts.file_name , ts.file_path ,ts.status,ts.created_at as createdAt,ts.rejection_reason ,ts.rework_reason as reworkReason , ts.approval_reason as approvalReason, ts.created_user as createdUser,ts.created_user_mail as createdUserMail,ts.rework,ts.remarks, se.employee_id AS employeeId , se.employee_name AS employeeName , ts.updated_at AS updatedAt
      FROM trim_swatch ts
      LEFT JOIN swatch_buyer b ON b.buyer_id = ts.buyer_id
      LEFT JOIN swatch_supplier s ON s.supplier_id = ts.supplier_id
      LEFT JOIN swatch_approval_users sau ON sau.approved_id = ts.approver_id
      LEFT JOIN swatch_employees se ON se.employee_id = sau.user_id
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
        reworkedData.rework = ReworkStatus.YES
        await this.repo.save(reworkedData);
        return new CommonResponseModel(true, 1, ' Sent for Rework ', reworkedData);
    } catch (err) {
        throw err;
    }
  }

  async reworkSentForApproval(req: TrimSwatchStatus): Promise<CommonResponseModel> {
    try {
      console.log(req,'service')
        const reworkedData = await this.repo.findOne({ where: { trimSwatchId : req.trimSwatchId } });
  
        if (!reworkedData) {
            throw new Error('Trim data not found');
        } 
        reworkedData.status = StatusEnum.SENT_FOR_APPROVAL;
        reworkedData.remarks = req.remarks
        await this.repo.save(reworkedData);
        return new CommonResponseModel(true, 1, 'Sent for Approval', reworkedData);
    } catch (err) {
        throw err;
    }
  }
  
  async getApprovedBy():Promise<CommonResponseModel>{
    let query = `SELECT se.employee_name AS employeeName,sau.approved_id as approvedId
    FROM trim_swatch ts
    LEFT JOIN swatch_approval_users sau ON sau.approved_id = ts.approver_id
    LEFT JOIN swatch_employees se ON se.employee_id = sau.user_id
    GROUP BY employee_name 
    ORDER BY employee_name ASC`
    const data = await this.dataSource.query(query)


    if(data.length>0){
      return new CommonResponseModel(true , 1 ,'Data retrieved',data)
    }else{
      return new CommonResponseModel(false ,0 , 'No Data',[])
    }
  }

  async getCreatedBy():Promise<CommonResponseModel>{
    let query = `SELECT created_user AS createdUser
    FROM trim_swatch ts
    GROUP BY created_user`
    const data = await this.dataSource.query(query)


    if(data.length>0){
      return new CommonResponseModel(true , 1 ,'Data retrieved',data)
    }else{
      return new CommonResponseModel(false ,0 , 'No Data',[])
    }
  }


  async getStatus():Promise<CommonResponseModel>{
    let query = `SELECT STATUS 
    FROM trim_swatch ts
    GROUP BY STATUS`
    const data = await this.dataSource.query(query)


    if(data.length>0){
      return new CommonResponseModel(true , 1 ,'Data retrieved',data)
    }else{
      return new CommonResponseModel(false ,0 , 'No Data',[])
    }
  }

  // async getTrimNumber():Promise<CommonResponseModel>{
  //   let query = ` SELECT trim_swatch_number AS trimSwatchNumber 
  //   FROM trim_swatch
  //   GROUP BY trim_swatch_number`
  //   const data = await this.dataSource.query(query)


  //   if(data.length>0){
  //     return new CommonResponseModel(true , 1 ,'Data retrieved',data)
  //   }else{
  //     return new CommonResponseModel(false ,0 , 'No Data',[])
  //   }
  // }

  async getReport(req:ReportReq):Promise<CommonResponseModel>{
    try{
      let query = `SELECT ts.trim_swatch_id , ts.trim_swatch_number ,ts.buyer_id AS buyerId,b.buyer_name AS buyerName,
        ts.supplier_id AS supplierId,s.supplier_name , ts.trim_swatch_id , ts.trim_swatch_number , ts.po_number , ts.item_no , ts.item_description, ts.invoice_no , ts.style_no , ts.grn_number , ts.grn_date , ts.file_name , ts.file_path ,ts.status,ts.created_at as createdAt,ts.rejection_reason ,ts.rework_reason as reworkReason , ts.approval_reason as approvalReason, ts.created_user as createdUser,ts.created_user_mail as createdUserMail,ts.rework,ts.remarks, se.employee_id AS employeeId , se.employee_name AS employeeName , ts.updated_at AS updatedAt
        FROM trim_swatch ts
        LEFT JOIN swatch_buyer b ON b.buyer_id = ts.buyer_id
        LEFT JOIN swatch_supplier s ON s.supplier_id = ts.supplier_id
        LEFT JOIN swatch_approval_users sau ON sau.approved_id = ts.approver_id
        LEFT JOIN swatch_employees se ON se.employee_id = sau.user_id
        WHERE 1=1
        `
       
        if (Array.isArray(req.swatchNumber)) {
          query += ` AND ts.trim_swatch_number IN ('${req.swatchNumber.join("','")}')`;
      }
      
      
      if(req.fromDate){
        query = query +` and DATE(ts.created_at) BETWEEN '${req.fromDate}' AND '${req.toDate}'`;
    }
      if(req.approverId){
          query = query +` and ts.approver_id = ${req.approverId}`;
      }
      if(req.createdUser){
          query = query +` and ts.created_user = '${req.createdUser}'`;
      }
      if(req.status){
          query = query +` and ts.status = '${req.status}'`;
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
