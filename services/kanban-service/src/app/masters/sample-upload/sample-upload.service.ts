import { Injectable } from '@nestjs/common';
import { CommonResponseModel, SampleCardReq } from 'libs/shared-models';
import { SampleUploadRepository } from './entity/sample-upload.repo';
import { SampleUpload } from './entity/sample-upload.entity';

@Injectable()
export class SampleUploadService {
  constructor(private readonly sampleRepo: SampleUploadRepository) {}

  async create(dto: any): Promise<CommonResponseModel> {
    const itemNo = await this.sampleRepo.find({where :{itemNo:dto.itemNo}})
    console.log(itemNo)
    if(itemNo.length > 0)return new CommonResponseModel(false, 1, 'Item No Already exists');
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
    entity.quantity = dto.quantity
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

async getData(req?:SampleCardReq):Promise<CommonResponseModel>{
    let query = `SELECT su.quantity as quantity, su.brand_id AS brandId , su.sample_id AS sampleId ,su.style_no AS styleNo, su.item_no AS itemNo , su.item_description AS itemDescription ,
    su.category_id AS categoryId , su.season_id AS seasonId , su.fabric_content AS fabricContent , su.fabric_count AS fabricCount , su.gsm AS gsm , su.fob AS fob ,
    su.qty_per_season AS qtyPerSeason, su.location_id AS locationId , su.file_name AS fileName , su.file_path AS filePath,sb.brand_name AS brandName,
    sc.category_name AS categoryName,sl.location_name AS locationName,ss.season_name AS seasonName FROM internal_apps.sample_upload su
    LEFT JOIN internal_apps.sample_brands_master sb ON sb.brand_id = su.brand_id 
    LEFT JOIN internal_apps.sample_category_master sc ON sc.category_id = su.category_id
    LEFT JOIN internal_apps.sample_location_master sl ON sl.location_id = su.location_id 
    LEFT JOIN internal_apps.sample_season_master ss ON ss.season_id = su.season_id WHERE su.sample_id > 0 `
    if(req.brandId){
        query = query + ` AND su.brand_id =  ${req.brandId}`
    }
    if(req.itemNo){
        query = query + ` AND su.item_no = '${ req.itemNo}'`
    }
    if(req.categoryId){
        query = query + ` AND su.category_id =  ${req.categoryId}`
    }
    if(req.locationId){
        query = query + ` AND su.location_id =  ${req.locationId}`
    }
    if(req.styleNo){
        query = query + ` AND su.style_no = '${req.styleNo}'`
    }
    const data = await this.sampleRepo.query(query)
    if(data)return new CommonResponseModel(true, 1, 'Data retrived successfully',data);
    return new CommonResponseModel(false, 0, 'Something went wrong'); 
}
}
