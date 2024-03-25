import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentEntity } from './entity/department.entity';
import { DepartmentDto } from './dto/department.dto';
import { DepartmentAdapter } from './adapter/department-adapter';
import { DepartmentRepository } from './repo/department-repo';
import { SectionsEntity } from './entity/section.entity';
import { CommonResponseModel, DepartmentIdReq } from 'libs/shared-models';

@Injectable()
export class DepartmentService {
 

  constructor(
    // @InjectRepository(DepartmentEntity)
    private repository: DepartmentRepository,
    private adapter: DepartmentAdapter
  ) { }


  async createDepartment(createDto: DepartmentDto):Promise<any> {
    const save=this.adapter.convertDtoToEntity(createDto);
    let internalMessage: string;
    if (createDto.Id) {
     internalMessage = "Updated Successfully"
      const findRecord = await this.repository.findOne({ where: { id: createDto.Id } });
      if (findRecord.versionFlag !== createDto.versionFlag) {}
    } else {
    internalMessage = "Created Successfully"
    }
    const savedData = await this.repository.save(save);
    return { data: savedData, message: internalMessage }
  }

  async getAllDepartments(): Promise<CommonResponseModel> {
    const data = await this.repository.find();
    if (data.length > 0) {
      return new CommonResponseModel(true , 3344,'data retrieve successfully',data)
    }else{
      return new CommonResponseModel(false , 33,'something went to wrong')
    }
  }
  // async getAllSectionsForDrop():Promise<CommonResponse>{
  //   const sectionsData = await projectPlanningDataSource.getRepository(SectionsEntity).query(``)
  // }

  async getAllSectionsForDrop(Req: DepartmentIdReq): Promise<CommonResponseModel> {
    // console.log(Req,'-------------------')
    try {
      let query = `SELECT DISTINCT department_id,section_id, section_name AS section
      FROM swatch_sections WHERE department_id > 0`;
  
      if (Req.departmentId) {
        query += ` AND department_id = '${Req.departmentId}'`; 
      }
      const Sections = await this.repository.query(query);
      return new CommonResponseModel(true, 11, 'Data retrieved', Sections);
    } catch (err) {
      throw err;
    }
  }



}