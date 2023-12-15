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
    entity.createdUser = dto.createdUser;
    const save = await this.userRepo.save(entity)
    if (save) return new CommonResponseModel(true, 1, 'Saved successfully');
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async getData(): Promise<CommonResponseModel> {
    const data = await this.userRepo.find({where :{isActive : true}})
     if (data) return new CommonResponseModel(true, 1, 'Data retrived successfully',data);
     return new CommonResponseModel(false, 0, 'Something went wrong');
   }

   async login (dto:any) : Promise<CommonResponseModel>{
    const validateUser = await this.userRepo.findOne({where:{userName : dto.userName , password: dto.password}})
    if(!validateUser) return new CommonResponseModel(false,1111,'Please check your credentials')
    const authData = new AuthModel(validateUser.userName,validateUser.userId)
    return new CommonResponseModel(true,1111,'Sucessfully logged in',authData)
}
}
