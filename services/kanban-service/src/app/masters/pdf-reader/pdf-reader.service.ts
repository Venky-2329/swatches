import { Injectable } from '@nestjs/common';
import { CommonResponseModel, TrimPodfModel } from 'libs/shared-models';
import { PdfReaderEntity } from './entity/pdf-reader.entity';
import { PdfReaderChildEntity } from './entity/pdf-child.entity';
import { PdfReaderEntityRepository } from './entity/pdf-reader.repo';
import { PdfReaderChildEntityRepository } from './entity/pdf-reader-child.repo';

@Injectable()
export class PdfReaderService {
  constructor(private readonly repo: PdfReaderEntityRepository,
    private readonly childRepo: PdfReaderChildEntityRepository) {}

  async saveData(dto: TrimPodfModel): Promise<CommonResponseModel> {
    console.log(dto);
    const obj = new PdfReaderEntity();
    obj.style = dto.style;
    obj.season = dto.season;
    obj.date = dto.date;
    obj.poNumber = dto.poNumber;
    obj.quantity = dto.quantity;
    obj.itemNo = dto.itemNo;
    obj.factory = dto.factory;
    obj.wash = dto.wash;
    obj.preparedBy = dto.preparedBy;
    obj.approvedBy = dto.approvedBy;
    obj.qaApproval = dto.qaApproval;
    obj.remarks = dto.remarks;
    const array =[];
    for (const type of dto.trimTypes) {
       const child = new PdfReaderChildEntity();
       child.type = type.type
       child.subType = type.subType
       child.code = type.trimDetails.code
       child.product = type.trimDetails.product
       child.materialArtworkDesc = type.trimDetails.materialArtworkDescription
       child.supplierQuote = type.trimDetails.supplierQuote
       child.uom = type.trimDetails.uom
       child.placement = type.trimDetails.placement
       child.contractorSupplied = type.trimDetails.contractorSupplied
       child.blkBlackColor = type.trimDetails.blkBlackColor
       child.blkBlackQtyByColor = type.trimDetails.blkBlackQtyByColor
       child.brnBrownColor = type.trimDetails.brnBrownColor
       child.brnBrownQtyByColor = type.trimDetails.brnBrownQtyByColor
       array.push(child)
       }
    obj.pdfChiltEntity = array 
    const save = await this.repo.save(obj)
    if(save) return new CommonResponseModel(true,1,'data saved',save)
    return new CommonResponseModel(false,0,'something went wrong')
    }
  
  async updatePath(req: any, file: any): Promise<CommonResponseModel> {
    const update = await this.childRepo.update({code:req.code},{blkFileName:file.fileName})

    return
  }
}
