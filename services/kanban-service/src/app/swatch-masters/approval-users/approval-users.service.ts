import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApprovalUserDto } from './dto/approval-user.dto';
import { Repository } from 'typeorm';
import { ApprovalIdReq, ApprovalUserReq, CommonResponseModel, CreateEmployeeDto } from 'libs/shared-models';
import { ApprovalUserEntity } from './entities/approval-user.entity';


@Injectable()
export class ApprovalUsersService {
  constructor(
    @InjectRepository(ApprovalUserEntity)
    private readonly repo: Repository<ApprovalUserEntity>
  ) { }

  async createApprovalUser(dto: ApprovalUserDto | ApprovalUserDto[]): Promise<CommonResponseModel> {
    const ApprovalUserArray = Array.isArray(dto) ? dto : [dto];

    try {
      for (const obj of ApprovalUserArray) {
        const existingRecord = await this.repo.findOne({ where: { userId: obj.userId } });


        if (existingRecord) {
          return new CommonResponseModel(false, 0, "user already existed", []);
        } else {
          for (const obj of ApprovalUserArray) {
            const entity = new ApprovalUserEntity()
            entity.approvedId = obj.approvedId;
            entity.userId = obj.userId;
            entity.emailId = obj.emailId;
            entity.signImageName = obj.signImageName;
            entity.signPath = obj.signPath;
            entity.createdUser = obj.createdUser;
            const create = await this.repo.save(entity)
            return await new CommonResponseModel(true, 111, 'Approved User created successfully', create)
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updatePath(filePath: string, fileName: string, id: number): Promise<CommonResponseModel> {
    try {
      let imagePathUpdate;
      imagePathUpdate = await this.repo.update(
        { approvedId: id },
        { signPath: filePath, signImageName: fileName },
      );
      const result = await this.repo.findOne({ where: { approvedId: id } })
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

  async getAllApprovalUser(): Promise<CommonResponseModel> {
    try {
      const query = `SELECT a.approved_id AS approvedId , a.user_id AS userId , a.email_id AS emailId , se.employee_name AS approvedUserName , a.is_active AS isActive
            FROM swatch_approval_users a
            LEFT JOIN swatch_employees se ON se.employee_id = a.user_id`
      const data = await this.repo.query(query)
      return await new CommonResponseModel(true, 111, 'Data Retrieved successfully', data)

    } catch (error) {
      console.log(error)
    }
  }

  async getAllApprovalIdUser(req: ApprovalIdReq): Promise<CommonResponseModel> {
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

  async activateOrDeactivateUser(req: ApprovalUserReq): Promise<CommonResponseModel> {
    try {
      const exist = await this.repo.findOne({ where: { approvedId: req.approvedId } })

      if (exist) {
        if (!exist) {
          return new CommonResponseModel(false, 0, 'Someone updated the current user information. Refersh and try again')
        } else {
          const statusUpdate = await this.repo.update({ approvedId: req.approvedId }, { isActive: req.isActive })

          if (exist.isActive) {
            if (statusUpdate.affected) {
              return new CommonResponseModel(true, 1, 'User Deactivated successfully')
            } else {
              return new CommonResponseModel(false, 0, 'User is already deactivated')
            }
          } else {
            if (statusUpdate.affected) {
              return new CommonResponseModel(true, 1, 'User Activated successfully')
            } else {
              return new CommonResponseModel(false, 0, 'User is already activated')
            }
          }
        }
      } else {
        return new CommonResponseModel(false, 10101, 'No Records Found')
      }
    } catch (error) {
      return error
    }
  }

  async getAllActiveApprovalUser(): Promise<CommonResponseModel> {
    try {
      const query = `SELECT a.approved_id AS approvedId , a.user_id AS approvedUserId , a.email_id AS emailId , se.employee_name AS approvedUserName , a.is_active AS isActive
      FROM swatch_approval_users a
      LEFT JOIN swatch_employees se ON se.employee_id = a.user_id 
      WHERE a.is_active = TRUE 
      ORDER BY approvedUserName ASC `
      // const data = await this.repo.find({ where: { isActive: true }, order: { emailId: 'ASC' } })
      const data = await this.repo.query(query)
      if (data.length)
        return await new CommonResponseModel(true, 111, 'Data Retrieved successfully', data)

    } catch (error) {
      console.log(error)
    }
  }




}
