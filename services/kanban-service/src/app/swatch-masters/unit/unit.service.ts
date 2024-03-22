
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitEntity } from './entity/unit.entity';
import { UnitAdapter } from './adapter/branch-adapter';
import { UnitDto } from './dto/unit.dto';
import { UnitRepository } from './repo/unit-repo';
import { CommonResponseModel, UnitReq } from 'libs/shared-models';

@Injectable()
export class UnitService {

  constructor(
    // @InjectRepository(UnitEntity)
    private repository: UnitRepository,
    private adapter: UnitAdapter
  ) { }



  async createUnit(createDto: UnitDto): Promise<any> {
    const save = this.adapter.convertDtoToEntity(createDto);
    let internalMessage: string
    if (createDto.id) {
      internalMessage = "Updated Successfully"
      const findRecord = await this.repository.findOne({ where: { id: createDto.id } });
      if (findRecord.versionFlag !== createDto.versionFlag) {

      }
    } else {
      internalMessage = "Created Successfully"
    }
    const savedData = await this.repository.save(save);

    return { data: savedData, message: internalMessage }

  }
  async getAllUnits(): Promise<CommonResponseModel> {

    try {
      const data = await this.repository.find({where:{isActive:true}});
      if (data.length > 0) {
        return new CommonResponseModel(true,22,'data retrieve successfully',data)
      }else{
        return new CommonResponseModel(false,22,'something went to wrong')
      }
    }catch(error){
      throw error
    }
  }

  async activateOrDeactivateUnits(req: UnitReq): Promise<CommonResponseModel> {
    console.log(req,'---------unit req')
    try {
      const unitExists = await this.getUnitsById(req.unitId);
      if (unitExists) {
        if (!unitExists) {
          throw new CommonResponseModel(false, 10113, 'Someone updated the current Unit information.Refresh and try again');
        } else {

          const unitStatus = await this.repository.update(
            { id: req.unitId },
            { isActive: req.isActive });

          if (unitExists.isActive) {
            if (unitStatus.affected) {
              const ProfitResponse: CommonResponseModel = new CommonResponseModel(true, 10115, 'Unit  is de-activated successfully');
              return ProfitResponse;
            } else {
              throw new CommonResponseModel(false, 10111, 'Unit is already deactivated');
            }
          } else {
            if (unitStatus.affected) {
              const ProfitResponse: CommonResponseModel = new CommonResponseModel(true, 10114, 'Unit is activated successfully');
              return ProfitResponse;
            } else {
              throw new CommonResponseModel(false, 10112, 'Unit  is already  activated');
            }
          }
        }
      } else {
        throw new CommonResponseModel(false, 99998, 'No Records Found');
      }
    } catch (err) {
      return err;
    }
  }

  async getUnitsById(unitId: number): Promise<UnitEntity> {
    const Response = await this.repository.findOne({
      where: { id:unitId },
    });
    if (Response) {
      return Response;
    } else {
      return null;
    }
  }


}