import { Injectable } from '@nestjs/common';
import { RacksEntity } from './entity/racks.entity';
import { CommonResponseModel, RacksDto } from 'libs/shared-models';
import { RacksEntityRepository } from './entity/racks.repo';
import { RacksChildEntity } from './entity/racks-child.entity';

@Injectable()
export class RacksService {
  constructor(private readonly racksRepo: RacksEntityRepository) {}

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
   const data = await this.racksRepo.find()
    if (data) return new CommonResponseModel(true, 1, 'Data retrived successfully',data);
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }
}
