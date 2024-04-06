import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApprovalUserDto } from './dto/approval-user.dto';
import { Repository } from 'typeorm';
import { ApprovalIdReq, CommonResponseModel } from 'libs/shared-models';
import { ApprovalUserEntity } from './entities/approval-user.entity';


@Injectable()
export class ApprovalUsersService {
  constructor(
    @InjectRepository(ApprovalUserEntity)
    private readonly repo : Repository<ApprovalUserEntity>
  ){}

  async createApprovalUser(dto : ApprovalUserDto | ApprovalUserDto[]): Promise<CommonResponseModel>{
    const ApprovalUserArray = Array.isArray(dto) ? dto : [dto];

    try {
      for (const obj of ApprovalUserArray){
        const existingRecord = await this.repo.findOne({where: { userId : obj.userId }});

        if (existingRecord){
          return new CommonResponseModel(false, 0, "user already existed", []);
        }else{
          for (const obj of ApprovalUserArray){
            const entity = new ApprovalUserEntity()
            entity.approvedId = obj.approvedId;
            entity.userId = obj.userId;
            entity.emailId = obj.emailId;
            entity.signImageName = obj.signImageName;
            entity.signPath = obj.signPath;
            entity.createdUser = obj.createdUser;
            const create = await this.repo.save(entity)
            console.log(create)
            return await new CommonResponseModel(true, 111, 'Approved User created successfully', create)
          }
        }
      }
        }catch(err){
    console.log(err);
          }
        }

        async updatePath(filePath : string , fileName: string , id: number): Promise<CommonResponseModel>{
          try {
            let imagePathUpdate;
            imagePathUpdate = await this.repo.update(
                { approvedId: id },
                { signPath: filePath, signImageName: fileName },
            );
            const result = await this.repo.findOne({where : {approvedId: id}})
            console.log('*****result*****', result)
            if (imagePathUpdate.affected > 0) {
              return new CommonResponseModel(true, 11, 'Uploaded successfully', filePath);
          }
          else {
              return new CommonResponseModel(false, 11, 'Uploaded failed', filePath);
          }
          } catch (error) {
            console.log(error);
          }
        }

       async  getAllApprovalUser(): Promise <CommonResponseModel>{
          try {
            const query = `SELECT a.approved_id AS approvedId , a.user_id AS approvedUserId , a.email_id AS emailId , se.employee_name AS approvedUserName
            FROM swatch_approval_users a
            LEFT JOIN swatch_employees se ON se.employee_id = a.user_id`
            const data = await this.repo.query(query)
            return await new CommonResponseModel(true, 111, 'Data Retrieved successfully', data)

          } catch (error) {
            console.log(error)
          }
        }

        async  getAllApprovalIdUser(req : ApprovalIdReq): Promise <CommonResponseModel>{
          try {
            const query = `SELECT a.approved_id AS approvedId , a.user_id AS approvedUserId , a.email_id AS emailId , se.employee_name AS approvedUserName , a.sign_path AS signPath
            FROM swatch_approval_users a
            LEFT JOIN swatch_employees se ON se.employee_id = a.user_id
            WHERE a.user_id = ${req.approvedUserId}`
            const data = await this.repo.query(query)
            return await new CommonResponseModel(true, 111, 'Data Retrieved successfully', data)

          } catch (error) {
            console.log(error)
          }
        }

      
  

}
