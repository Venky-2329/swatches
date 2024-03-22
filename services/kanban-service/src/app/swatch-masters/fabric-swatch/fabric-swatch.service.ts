import { Injectable } from "@nestjs/common";
import { FabricSwatchEntity } from "./fabric-swatch-entity";
import { CommonResponseModel, StatusEnum } from "libs/shared-models";
import { FabricSwatchDto } from "./fabric-swatch-dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class FabricSwatchService{
    constructor(
      @InjectRepository(FabricSwatchEntity)
      private readonly repo: Repository<FabricSwatchEntity>,
      private readonly dataSource: DataSource
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
            entityData.itemNo = req.itemNo
            entityData.itemDescription = req.itemDescription
            entityData.categoryType = req.categoryType
            entityData.categoryId = req.categoryId
            entityData.seasonId = req.seasonId
            entityData.mill = req.mill
            entityData.color = req.color
            entityData.poNumber = req.poNumber
            entityData.grnNumber = req.grnNumber
            entityData.grnDate = date
            entityData.status = StatusEnum.OPEN
            const saveData = await this.repo.save(entityData)
            return new CommonResponseModel(true,1,`${saveData.fabricSwatchNumber} created successfully`,saveData)
        }catch(err){
            throw(err)
        }
    }

    async updatePath(filePath: string,filename: string,fabricSwatchId: number): Promise<CommonResponseModel> {
        try {
          const filePathUpdate = await this.repo.update({ fabricSwatchId: fabricSwatchId },{ filePath: filePath, fileName: filename });
        //   const result = await this.repo.findOne({where: { fabricSwatchId: fabricSwatchId } });
          if (filePathUpdate.affected > 0) {
            return new CommonResponseModel(true,11,'uploaded successfully',filePath);
          } else {
            return new CommonResponseModel(false, 11, 'uploaded failed', filePath);
          }
        } catch (error) {}
    }

    async getAllFabricSwatchData():Promise<CommonResponseModel>{
      try{
        let query = `SELECT fs.fabric_swatch_id AS fabricSwatchId,fs.fabric_swatch_number AS fabricSwatchNo, fs.style_no styleNo,fs.item_no AS itemNo,fs.category_type AS categoryType,fs.color,fs.po_number AS poNumber,
        fs.grn_number AS grnNumber,fs.item_description AS itemDescription,fs.mill, fs.status,
        fs.buyer_id AS buyerId,b.buyer_name AS buyerName,
        fs.brand_id AS brandId,sbm.brand_name AS brandName,
        fs.category_id AS categoryId,scm.category_name AS categoryName,
        fs.season_id AS seasonId,ssm.season_name AS seasonName,fs.grn_date as grnDate
        FROM fabric_swatch fs
        LEFT JOIN buyer b ON b.buyer_id = fs.buyer_id
        LEFT JOIN sample_brands_master sbm ON sbm.brand_id = fs.brand_id
        LEFT JOIN sample_category_master scm ON scm.category_id = fs.category_id
        LEFT JOIN sample_season_master ssm ON ssm.season_id = fs.season_id`
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
          COALESCE(SUM(CASE WHEN STATUS = 'open' THEN 1 ELSE 0 END),0) AS openCount,
          COALESCE(SUM(CASE WHEN STATUS = 'approved' THEN 1 ELSE 0 END),0) AS approvedCount,
          COALESCE(SUM(CASE WHEN STATUS = 'rejected' THEN 1 ELSE 0 END),0) AS rejectedCount
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
}