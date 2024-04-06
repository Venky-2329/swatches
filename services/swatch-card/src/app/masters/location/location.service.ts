import { Injectable } from '@nestjs/common';
import { CommonResponseModel } from 'libs/shared-models';
import { LocationEntityRepository } from './entity/location.repo';
import { LocationEntity } from './entity/location.entity';

@Injectable()
export class LocationService {
  constructor(
    private readonly locationRepo: LocationEntityRepository,
  ) {}

  async create(dto:any):Promise<CommonResponseModel>{
    const entity = new LocationEntity();
    entity.locationName = dto.locationName;
    entity.createdUser = dto.createdUser;
    const save = await this.locationRepo.save(entity)
    if (save) return new CommonResponseModel(true, 1, 'Saved successfully');
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async getData(): Promise<CommonResponseModel> {
    const data = await this.locationRepo.find({where :{isActive : true}})
     if (data) return new CommonResponseModel(true, 1, 'Data retrived successfully',data);
     return new CommonResponseModel(false, 0, 'Something went wrong');
   }
}
