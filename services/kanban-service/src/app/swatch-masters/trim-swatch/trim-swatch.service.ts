import { Injectable } from '@nestjs/common';
import { TrimSwatchDto } from './dto/trim-swatch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TrimSwatchEntity } from './entities/trim-swatch.entity';
import { Repository } from 'typeorm';
import { CommonResponseModel, StatusEnum } from 'libs/shared-models';

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
      const formattedDate = new Date(req.grnDate).toISOString().slice(0,10)
      const date = new Date(formattedDate)

      const entityData = new TrimSwatchEntity()
      const getId = await this.getMaxId()

      if(getId !== undefined){
        entityData.trimSwatchNumber = "TSW" + '-' + Number(getId.trimSwatchId + 1).toString().padStart(6,'0');
      }

      entityData.buyerId = req.buyerId
      entityData.suppplierId = req.suppplierId
      entityData.poNumber = req.poNumber
      entityData.itemNo = req.itemNo
      entityData.itemDescription = req.itemDescription
      entityData.invoiceNo = req.invoiceNo
      entityData.styleNo = req.styleNo
      entityData.merchant = req.merchant
      entityData.grnNumber = req.grnNumber
      entityData.grnDate = date
      entityData.status = StatusEnum.OPEN
      entityData.checkedBy = req.checkedBy
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

  async getAllTrimSwatchData():Promise<CommonResponseModel>{
    try {
      const query = `SELECT ts.buyer_id AS buyerId,b.buyer_name AS buyerName,
      ts.supplier_id AS supplierId,s.supplier_name , ts.trim_swatch_id , ts.trim_swatch_number , ts.po_number , ts.item_no , ts.item_description, 
      ts.invoice_no , ts.style_no ,ts.merchant , ts.grn_number , ts.grn_date , ts.checked_by , ts.file_name , ts.file_path ,ts.status
      FROM trim_swatch ts
      LEFT JOIN buyer b ON b.buyer_id = ts.buyer_id
      LEFT JOIN supplier s ON s.supplier_id = ts.supplier_id`
      const data = await this.repo.query(query)

      if (data){
        return new CommonResponseModel(true,1,'Data retrieved successfully',data)
      }else{
        return new CommonResponseModel(false,0,'No data found',[])
      }
    } catch (error) {
      throw(error)
    }
  }

}
