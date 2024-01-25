import { Injectable } from '@nestjs/common';
import {
  CommonResponseModel,
  PdfIdReq,
  TrimPodfModel,
} from 'libs/shared-models';
import { PdfReaderEntity } from './entity/pdf-reader.entity';
import { PdfReaderChildEntity } from './entity/pdf-child.entity';
import { PdfReaderEntityRepository } from './entity/pdf-reader.repo';
import { PdfReaderChildEntityRepository } from './entity/pdf-reader-child.repo';
import * as XLSX from 'xlsx';

@Injectable()
export class PdfReaderService {
  constructor(
    private readonly repo: PdfReaderEntityRepository,
    private readonly childRepo: PdfReaderChildEntityRepository
  ) {}

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
    obj.pdfFileName = dto.pdfFileName;
    const array = [];
    for (const type of dto.trimTypes) {
      const child = new PdfReaderChildEntity();
      child.type = type.type;
      child.subType = type.subType;
      child.code = type.trimDetails.code;
      child.product = type.trimDetails.product;
      child.materialArtworkDesc = type.trimDetails.materialArtworkDescription;
      child.supplierQuote = type.trimDetails.supplierQuote;
      child.uom = type.trimDetails.uom;
      child.placement = type.trimDetails.placement;
      child.contractorSupplied = type.trimDetails.contractorSupplied;
      child.blkBlackColor = type.trimDetails.blkBlackColor;
      child.blkBlackQtyByColor = type.trimDetails.blkBlackQtyByColor;
      child.brnBrownColor = type.trimDetails.brnBrownColor;
      child.brnBrownQtyByColor = type.trimDetails.brnBrownQtyByColor;
      child.brnFileName = type.trimDetails.brnFileName;
      child.blkFileName = type.trimDetails.blkFileName;
      array.push(child);
    }
    obj.pdfChiltEntity = array;
    const save = await this.repo.save(obj);
    if (save) return new CommonResponseModel(true, 1, 'data saved', save);
    return new CommonResponseModel(false, 0, 'something went wrong');
  }

  async updatePath(req: any, file: any): Promise<CommonResponseModel> {
    const update = await this.childRepo.update(
      { code: req.code },
      { blkFileName: file.fileName }
    );
    return;
  }

  async getPdfData(req: PdfIdReq): Promise<CommonResponseModel> {
    const query = `SELECT pr.date AS trimDate ,pr.season,pr.po_number AS poNumber, pr.style , pr.quantity, pr.item_no AS itemNo , pr.factory AS factory , pr.wash , pr.prepared_by AS preparedBy , pr.approved_by AS approvedBy ,
      pr.qa_approval AS qaApproval , pr.remarks , pr.pdf_file_name AS pdfFileName ,pr.pdf_file_path AS pdfFilePath ,prc.type , prc.sub_type AS subType ,
      prc.code, prc.product , prc.material_artwork_desc AS materialArtworkDesc ,prc.supplier_quote AS supplierQuote, prc.placement,prc.contractor_supplied AS contractorSupplied, prc.brn_brown_color AS brnBrownColor
      , prc.brn_brown_qty_by_color AS brnBrownQtyByColor , prc.blk_black_color AS blkBlackColor , prc.blk_black_qty_by_color AS blkBlackQtyByColor ,prc.blk_file_path AS blkFilePath
       ,prc.blk_file_name AS blkFileName ,prc.brn_file_path AS brnFilePath ,prc.brn_file_name AS brnFileName  FROM pdf_reader pr 
      LEFT JOIN pdf_reader_child prc ON prc.pdf_id = pr.pdf_id WHERE pr.pdf_id = ${req.pdfId}`;
    const data = await this.repo.query(query);
    if (data.length)
      return new CommonResponseModel(true, 1, 'Data retrived', data);
    return new CommonResponseModel(false, 0, 'No data found');
  }

  async getPdfGridData(): Promise<CommonResponseModel> {
    const query = `SELECT pr.pdf_id AS pdfId,pr.date AS trimDate , pr.style , pr.quantity, pr.item_no AS itemNo , pr.factory AS factory , pr.wash , pr.prepared_by AS preparedBy , pr.approved_by AS approvedBy ,
      pr.qa_approval AS qaApproval , pr.remarks , pr.pdf_file_name AS pdfFileName ,pr.pdf_file_path AS pdfFilePath FROM  pdf_reader pr`;
    const data = await this.repo.query(query);
    if (data.length)
      return new CommonResponseModel(true, 1, 'Data retrived', data);
    return new CommonResponseModel(false, 0, 'No data found');
  }

  async convertExcelToJson(file): Promise<any[]> {
    return new Promise((resolve, reject) => {
      try {
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          raw: false,
          // dateNF: 'DD/MM/YYYY HH:mm'
        });
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    });
  }

  async saveExcelData(val): Promise<CommonResponseModel> {
    console.log('---------------------', val);
    const jsonData: any[] = await this.convertExcelToJson(val);
    console.log(jsonData)
    const headerRow = jsonData[0];

    const dataRows = jsonData.slice(1);
    if (!jsonData.length) {
      return new CommonResponseModel(true, 1110, 'No data found in excel');
  }
    if (val)
      return new CommonResponseModel(
        true,
        1111,
        'Data saved sucessfully'
        // jsonArray
      );
    return new CommonResponseModel(false, 0, 'not uploaded');
  }
}
