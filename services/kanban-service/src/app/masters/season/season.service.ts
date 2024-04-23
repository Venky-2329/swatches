import { Injectable } from '@nestjs/common';
import { CategoryReq, CommonResponseModel, SeasonDto, seasonReq } from 'libs/shared-models';
import { SeasonEntityRepository } from './entity/season.repo';
import { SeasonEntity } from './entity/season.entity';

@Injectable()
export class SeasonService {
  constructor(private readonly seasonRepo: SeasonEntityRepository) { }

  async create(dto: SeasonDto, isUpdate: boolean): Promise<CommonResponseModel> {

    const exist = await this.seasonRepo.findOne({ where: { seasonName: dto.seasonName } })

    const entity = new SeasonEntity();
    entity.seasonName = dto.seasonName;
    entity.createdUser = dto.createdUser;
    if (dto.seasonId) {
      entity.seasonId = dto.seasonId;
      entity.updatedUser = dto.updatedUser
    }

    const save = await this.seasonRepo.save(entity);
    if (save) return new CommonResponseModel(true, 1, 'Saved successfully');
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async getData(): Promise<CommonResponseModel> {
    const data = await this.seasonRepo.find();
    if (data)
      return new CommonResponseModel(
        true,
        1,
        'Data retrived successfully',
        data
      );
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async activateOrDeactivateSeason(req: seasonReq): Promise<CommonResponseModel> {
    try {
      const exists = await this.seasonRepo.find({ where: { seasonId: req.seasonId } })
      if (exists) {
        if (!exists) {
          return new CommonResponseModel(false, 0, 'Someone updated the current Season information. Refresh and try again')
        }
        else {
          const statusUpdate = await this.seasonRepo.update(
            { seasonId: req.seasonId },
            { isActive: req.isActive }
          )
          if (exists[0].isActive) {
            if (statusUpdate.affected) {
              return new CommonResponseModel(true, 1, 'Season is Deactivated Succesfully')
            } else {
              return new CommonResponseModel(true, 1, 'Season is already Deactivated ')
            }
          } else {
            if (statusUpdate.affected) {
              return new CommonResponseModel(true, 1, 'Season is Activated Succesfully')
            } else {
              return new CommonResponseModel(true, 1, 'Season is already Activated ')
            }
          }
        }
      }
    } catch (error) {
      return error
    }
  }
}
