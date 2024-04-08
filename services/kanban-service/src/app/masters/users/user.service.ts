import { Injectable } from '@nestjs/common';
import { CommonResponseModel } from 'libs/shared-models';
import { UserEntityRepository } from './entity/user.repo';
import { UserEntity } from './entity/user.entity';
import { AuthModel } from './auth.model';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserEntityRepository,
  ) {}

  async create(dto:any):Promise<CommonResponseModel>{
    const entity = new UserEntity();
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
    const data = await this.userRepo.find({where :{isActive : true}})
     if (data) return new CommonResponseModel(true, 1, 'Data retrieved successfully',data);
     return new CommonResponseModel(false, 0, 'Something went wrong');
   }

   async login (dto:any) : Promise<CommonResponseModel>{
    const validateUser = await this.userRepo.findOne({where:{userName : dto.userName , password: dto.password}})
    if(!validateUser) return new CommonResponseModel(false,1111,'Please check your credentials')
    const authData = new AuthModel(validateUser.userName,validateUser.userId,validateUser.email,validateUser.role,validateUser.departmentId)
    return new CommonResponseModel(true,1111,'Successfully logged in',authData)
}
}
