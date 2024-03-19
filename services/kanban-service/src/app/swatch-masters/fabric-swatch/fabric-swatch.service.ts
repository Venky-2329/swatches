import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FabricSwatchEntity } from "./fabric-swatch-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonResponseModel } from "libs/shared-models";
import { FabricSwatchDto } from "./fabric-swatch-dto";

@Injectable()
export class FabricSwatchService{
    constructor(
        @InjectRepository(FabricSwatchEntity)
        private readonly repo: Repository<FabricSwatchEntity>,
        private readonly dataSource: DataSource,

    ){}

    async getMaxId():Promise<any>{
        let query = `max(fabric_swatch_id) as fabricSwatchId FROM fabric_swatch ORDER BY created_at = 'DESC'`
        const data = await this.dataSource.query(query)
        return data
    }

    async createFabricSwatch(req: FabricSwatchDto): Promise<CommonResponseModel>{
        try{
            const entityData = new FabricSwatchEntity() 
            const getId = await this.getMaxId()
            if (getId !== undefined) {
                entityData.fabricSwatchNumber = "FAB" + '-' + Number(getId.fabricSwatchId).toString().padStart(3, '0');
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
            const saveData = await this.repo.save(entityData)
            return new CommonResponseModel(true,1,'Fabric Swatch created successfully',saveData)
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
}