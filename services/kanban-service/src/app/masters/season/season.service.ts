import { Injectable } from '@nestjs/common';
import { CommonResponseModel, SeasonDto } from 'libs/shared-models';
import { SeasonEntityRepository } from './entity/season.repo';
import { SeasonEntity } from './entity/season.entity';

@Injectable()
export class SeasonService {
  constructor(private readonly seasonRepo: SeasonEntityRepository) {}

  async create(dto: SeasonDto): Promise<CommonResponseModel> {
    const entity = new SeasonEntity();
    entity.seasonName = dto.seasonName;
    entity.createdUser = dto.createdUser;
    if (dto.seasonId) {
      entity.seasonId = dto.seasonId;
    }
    
    const save = await this.seasonRepo.save(entity);
    if (save) return new CommonResponseModel(true, 1, 'Saved successfully');
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async getData(): Promise<CommonResponseModel> {
    const data = await this.seasonRepo.find({ where: { isActive: true } });
    if (data)
      return new CommonResponseModel(
        true,
        1,
        'Data retrived successfully',
        data
      );
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }
}
