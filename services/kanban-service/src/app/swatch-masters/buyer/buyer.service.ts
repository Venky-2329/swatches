import { Injectable } from '@nestjs/common';
import { BuyerDto } from './dto/buyer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerEntity } from './entities/buyer.entity';
import { Repository } from 'typeorm';
import { BuyerReq, CommonResponseModel, ErrorResponse } from 'libs/shared-models';

@Injectable()
export class BuyerService {

  constructor(
    @InjectRepository(BuyerEntity)
    private readonly repo: Repository<BuyerEntity>
  ) { }

  async createBuyer(dto: BuyerDto, isUpdate: boolean): Promise<CommonResponseModel> {
    try {
      const existing = await this.repo.findOne({ where: { buyerName: dto.buyerName } })
      if (existing && (!isUpdate || (isUpdate && existing.buyerId !== dto.buyerId))) {
        return new CommonResponseModel(false, 0, 'Buyer already exists');
      }
      const entityData = new BuyerEntity();
      entityData.buyerName = dto.buyerName
      // entityData.isActive = dto.isActive 
      if (dto.buyerId) {
        entityData.buyerId = dto.buyerId;
        entityData.updatedUser = dto.updatedUser;
      } else {
        entityData.createdUser = dto.createdUser;
        entityData.buyerName = dto.buyerName
      }
      const save = await this.repo.save(entityData);
      return new CommonResponseModel(true, 1, isUpdate ? 'Buyer Updated Successfully' : 'Buyer Created Successfully', save)

    } catch (error) {
      throw (error)
    }
  }

  async getAllActiveBuyers(): Promise<CommonResponseModel> {
    try {
      const data = await this.repo.find({ where: { isActive: true }, order: { buyerName: 'ASC' } })
      if (data) {
        return new CommonResponseModel(true, 1, 'Data retrieved successfully', data)
      } else {
        return new CommonResponseModel(false, 0, 'No data found', [])
      }
    } catch (err) {
      throw (err)
    }
  }

  async getAllBuyers(): Promise<CommonResponseModel> {
    try {
      const data = await this.repo.find({ order: { buyerName: 'ASC' } })
      if (data.length) {
        return new CommonResponseModel(true, 1, 'Data retrieved successfully', data)
      } else {
        return new CommonResponseModel(false, 0, 'No data found', [])
      }
    } catch (err) {
      throw (err)
    }
  }

  async activateOrDeactivateBuyer(req: BuyerReq): Promise<CommonResponseModel> {
    try {
      const buyerExists = await this.repo.findOne({
        where: { buyerId: req.buyerId },
      })
      if (buyerExists) {
        if (!buyerExists) {
          throw new ErrorResponse(1011, 'Someone updated the current Buyer information. Refresh and try again')
        } else {
          const status = await this.repo.update(
            { buyerId: req.buyerId },
            { isActive: req.isActive, updatedUser: req.updatedUser }

          );

          if (buyerExists.isActive) {
            if (status.affected) {
              return new CommonResponseModel(true, 1, 'Buyer is Deactivated successfully')
            } else {
              throw new CommonResponseModel(false, 0, 'Buyer is already Deactivated')
            }
          } else {
            if (status.affected) {
              return new CommonResponseModel(true, 1, 'Buyer is Activated Succesfully')
            } else {
              throw new CommonResponseModel(false, 0, 'Buyer is Already Activated')
            }
          }
        }
      } else {
        throw new CommonResponseModel(false, 0, 'No Records Found')
      }
    } catch (error) {
      // return new CommonResponseModel(false , 0 , 'Something Went Wrong');
      console.log(error)
    }
  }


}
