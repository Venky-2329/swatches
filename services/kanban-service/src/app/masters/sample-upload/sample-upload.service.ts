import { Injectable } from '@nestjs/common';
import { CommonResponseModel } from 'libs/shared-models';
import { SampleUploadRepository } from './entity/sample-upload.repo';
import { SampleUpload } from './entity/sample-upload.entity';

@Injectable()
export class SampleUploadService {
  constructor(private readonly sampleRepo: SampleUploadRepository) {}

  async create(dto: any): Promise<CommonResponseModel> {
    const itemNo = await this.sampleRepo.find({where :{itemNo:dto.itemNo}})
    if(itemNo != undefined)return new CommonResponseModel(false, 1, 'Item No Already exists');
    const entity = new SampleUpload();
    entity.brandId = dto.brandId;
    entity.styleNo = dto.styleNo;
    entity.itemNo = dto.itemNo;
    entity.itemDescription = dto.itemDescription;
    entity.categoryId = dto.categoryId;
    entity.seasonId = dto.seasonId;
    entity.fabricContent = dto.fabricContent;
    entity.fabricCount = dto.fabricCount;
    entity.createdUser = dto.createdUser;
    entity.gsm = dto.gsm;
    entity.fob = dto.fob;
    entity.qtyPerSeason = dto.qtyPerSeason;
    entity.locationId = dto.locationId;
    const save = await this.sampleRepo.save(entity);
    if (save) return new CommonResponseModel(true, 1, 'Saved successfully',save);
    return new CommonResponseModel(false, 0, 'Something went wrong');
  }

  async updatePath(filePath: string, filename: string, sampleId: number): Promise<CommonResponseModel> {
    try {
        const filePathUpdate = await this.sampleRepo.update(
            { sampleId: sampleId },
            { filePath: filePath, fileName: filename },
        );
        const result = await this.sampleRepo.findOne({ where: { sampleId: sampleId } })
        if (filePathUpdate.affected > 0) {
            return new CommonResponseModel(true, 11, 'uploaded successfully', filePath);
        }
        else {
            return new CommonResponseModel(false, 11, 'uploaded failed', filePath);
        }
    }
    catch (error) {
    }
}

async getData():Promise<CommonResponseModel>{
    const data = await this.sampleRepo.find()
    if(data)return new CommonResponseModel(true, 1, 'Data retrived successfully',data);
    return new CommonResponseModel(false, 0, 'Something went wrong'); 
}
}
