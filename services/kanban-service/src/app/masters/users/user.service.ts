import { Injectable } from '@nestjs/common';
import { CommonResponseModel, UserDto, userReq } from 'libs/shared-models';
import { UserEntityRepository } from './entity/user.repo';
import { UserEntity } from './entity/user.entity';
import { AuthModel } from './auth.model';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserEntityRepository,
  ) { }

  async create(dto: UserDto, isUpdate: boolean): Promise<CommonResponseModel> {

    const existing = await this.userRepo.findOne({ where: { userName: dto.userName } })

    if (existing && (!isUpdate || (isUpdate && existing.userId !== dto.userId))) {
      return new CommonResponseModel(false, 0, 'User already exists');
    }
    const entity = new UserEntity();
    if (dto.userId) {
      entity.userId = dto.userId;
      entity.updatedUser = dto.updatedUser
    }
    entity.userName = dto.userName;
    entity.password = dto.password;
    entity.employeeId = dto.employeeId
    entity.departmentId = dto.departmentId
    entity.role = dto.role
    entity.createdUser = dto.createdUser;
    entity.email = dto.email
    const save = await this.userRepo.save(entity)
    if (save) return new CommonResponseModel(true, 1, 'Saved successfully');
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async getData(): Promise<CommonResponseModel> {
    const data = await this.userRepo.find()
    if (data) return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async login(dto: any): Promise<CommonResponseModel> {
    const validateUser = await this.userRepo.findOne({ where: { userName: dto.username, password: dto.password } })
    if (!validateUser) return new CommonResponseModel(false, 1111, 'Please check your credentials')
    const authData = new AuthModel(validateUser.userName, validateUser.userId, validateUser.email, validateUser.role, validateUser.departmentId)
    return new CommonResponseModel(true, 1111, 'Successfully logged in', authData)
  }

  async activateOrDeactivateUser(req: userReq): Promise<CommonResponseModel> {
    try {
      const exist = await this.userRepo.findOne({ where: { userId: req.userId } })

      if (exist) {
        if (!exist) {
          return new CommonResponseModel(false, 1011, 'Someone updated the current User information. Refresh and try again')
        } else {
          const statusUpdate = await this.userRepo.update(
            { userId: req.userId },
            { isActive: req.isActive }
          )

          if (exist.isActive) {
            if (statusUpdate.affected) {
              return new CommonResponseModel(true, 1, 'User Deactivated Successfully')
            } else {
              return new CommonResponseModel(false, 0, 'User is already deactivated ')
            }
          } else {
            if (statusUpdate.affected) {
              return new CommonResponseModel(true, 1, 'User Activated Successfully')
            } else {
              return new CommonResponseModel(false, 0, 'User is already activated ')
            }
          }
        }
      } else {
        return new CommonResponseModel(false, 0, 'No Records Found')
      }
    } catch (error) {
      return error
    }
  }

  async getActiveUser(): Promise<CommonResponseModel> {
    const data = await this.userRepo.find({ where: { isActive: true } })
    if (data) return new CommonResponseModel(true, 1, 'Data retrieved successfully', data);
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }


}
