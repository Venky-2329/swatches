import { Injectable } from '@nestjs/common';
import { RacksEntity } from './entity/racks.entity';
import { CommonResponseModel, RackStatus, RacksDto } from 'libs/shared-models';
import { RacksEntityRepository } from './entity/racks.repo';
import { RacksChildEntity } from './entity/racks-child.entity';
import { RacksChildEntityRepository } from './entity/racks-child.repo';

@Injectable()
export class RacksService {
  constructor(private readonly racksRepo: RacksEntityRepository ,
    private readonly childRackRepo : RacksChildEntityRepository) {}

  async saveRacks(dto: RacksDto): Promise<CommonResponseModel> {
    const rack = await this.racksRepo.findOne({where : {rackName : dto.rackName}})
    if(rack) return new CommonResponseModel(false,0,'Rack Name already exists')
    const entity = new RacksEntity();
    entity.rackName = dto.rackName;
    entity.columns = dto.columns;
    entity.rows = dto.rows;
    entity.createdUser = 'admin';
    const childEntity : RacksChildEntity[] = [];
    for(const child of dto.tableData){
      for (const inputKey in child) {
        if (Object.prototype.hasOwnProperty.call(child, inputKey) && inputKey !== 'key') {
          const entityObj = new RacksChildEntity();
          entityObj.subRackName = child[inputKey].toString();
          entityObj.createdUser = 'admin';
          childEntity.push(entityObj);
        }
      }
    }
    entity.racksChiltEntity = childEntity;
    const save = await this.racksRepo.save(entity);
    if (save) return new CommonResponseModel(true, 1, 'Racks saved successfully');
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async getData(): Promise<CommonResponseModel> {
   const data = await this.racksRepo.find({where :{isActive : true}})
    if (data) return new CommonResponseModel(true, 1, 'Data retrived successfully',data);
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async getRacksData(): Promise<CommonResponseModel> {
    const query = `SELECT rc.sub_rack_name AS subRack , rm.rack_name AS rackName ,rc.id AS subRackId , CONCAT (rm.rack_name ,'-',rc.sub_rack_name ) AS rack FROM internal_apps.racks_child_master rc
    LEFT JOIN internal_apps.racks_master rm ON rm.id = rc.rack_id
    WHERE rc.rack_status != 'FULLY_OCCUPIED'`
    const data = await this.childRackRepo.query(query)
    console.log(data)
     if (data) return new CommonResponseModel(true, 1, 'Data retrived successfully',data);
     return new CommonResponseModel(false, 0, 'Something went wrong');
   }

   async updateRackStatus(req:RackStatus):Promise<CommonResponseModel>{
      const updateStatus = await this.childRackRepo.update({id:req.racksId},{rackStatus :req.rackStatus});
      if(updateStatus.affected) return new CommonResponseModel (true ,1,'rack status updated',updateStatus)
      return new CommonResponseModel (false,0,'Something went wrong on updation')
   }
}
