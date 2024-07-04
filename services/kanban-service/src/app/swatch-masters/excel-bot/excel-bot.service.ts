import { Injectable } from "@nestjs/common";
import { Cron } from '@nestjs/schedule';
import axios from "axios";
import { BuyerReq, CommonResponseModel } from "libs/shared-models";
import * as XLSX from 'xlsx';
import puppeteer, { Frame, Page } from 'puppeteer';
import path from "path";
import { ItemExcelEntity } from "./entities/item-excel.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, ILike, Raw, Repository } from "typeorm";
import { BuyerEntity } from "../buyer/entities/buyer.entity";
import { POItemExcelEntity } from "./entities/po-item-excel.entity";
const fs = require('fs');

@Injectable()
export class ExcelBotService{
    constructor(
      @InjectRepository(ItemExcelEntity)
      private readonly iemExcelRepo: Repository<ItemExcelEntity>,
      @InjectRepository(BuyerEntity)
      private readonly buyerRepo: Repository<BuyerEntity>,
      @InjectRepository(POItemExcelEntity)
      private readonly poItemRepo: Repository<POItemExcelEntity>,
      private readonly dataSource : DataSource
    ){}



    async itemResponsibleReport(): Promise<CommonResponseModel>{
      const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        args: [
          '--disable-infobars', 
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--start-maximized'
        ]
    });
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      try{
        const [page] = await browser.pages();
        const screen = await page.evaluateHandle(() => ({
          width: window.screen.availWidth,
          height: window.screen.availHeight,
      }));
      const { width, height } = await screen.jsonValue();
      await page.setViewport({ width, height });
        await page.goto('http://intranetn.shahi.co.in:8080/ShahiExportIntranet/login#');
        await page.type('#username','755921')
        await page.type('#password','vis123')
        await Promise.all([
          page.waitForNavigation(),
          page.click('button.btn-primary')
        ])
        if(page.url().includes('invaliduser')){
          throw Error('Invalid username or password')
        }

        await delay(3000)
        await page.goto('http://intranetn.shahi.co.in:8080/ShahiExportIntranet/subApp?slNo=2447')

        await delay(3000)
        await page.goto('http://intranetn.shahi.co.in:8080/ShahiExportIntranet/subApp?slNo=3040')
        
        await delay(3000)
        await page.goto('http://intranetn.shahi.co.in:8080/ShahiExportIntranet/subApp?slNo=3041')

        await delay(3000)
        await page.goto('http://report.shahi.co.in:8080/ShahiReportsNewM3/SCM/ItemResponsibleReport/ItemResponsibleReport.jsp?aausrid=755921')

        // Set the date inputs
        const fromDate = new Date();
        const toDate = new Date();
        fromDate.setFullYear(fromDate.getFullYear() - 1);  // One year ago
        // fromDate.setMonth(fromDate.getMonth() - 1);  // Uncomment for one month ago

        const formatDate = (date) => {
            const day = ("0" + date.getDate()).slice(-2);
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        await page.evaluate((fromDate, toDate) => {
            (document.getElementById('date1')as HTMLInputElement).value = fromDate;
            (document.getElementById('date2') as HTMLInputElement).value = toDate;
        }, formatDate(fromDate), formatDate(toDate));

        await delay(1000);  // Adjust delay if necessary

        await page.evaluate(() => {
          const faciInput = document.getElementById('faciInput');
          if (faciInput && faciInput instanceof HTMLSelectElement) {
            const option = Array.from(faciInput.options).find(option => option.text.includes('Shahi Exports Pvt.Ltd. ~ MNB-340'));
            if (option) {
              option.selected = true;
              
              // Trigger the addFACI() function
              const addFaciLink = document.querySelector('a[onclick="addFACI();"]')as HTMLInputElement;
              if (addFaciLink) {
                addFaciLink.click();
              }
            }
          }
        });

        await delay(1000);

        console.log('pch')

        await page.evaluate(()=>{
          const pchInput =  document.getElementById('pchInput')
          if(pchInput && pchInput instanceof HTMLSelectElement){
            const option = Array.from(pchInput.options).find(option => option.value ==='MNB')
            if(option){
              option.selected = true

              const addPCHLink = document.querySelector('a[onclick="addPCH();"]')as HTMLInputElement;
              if (addPCHLink) {
                addPCHLink.click();
              }
            }
          }
        })

        await page.evaluate(() => {
          // Ensure the XLS radio button is selected
          const xlsRadio = document.querySelector('body > form > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(6) > td > input[type=radio]:nth-child(2)')as HTMLInputElement;
          if (xlsRadio) {
            console.log('XLS radio button found');
            xlsRadio.click();
          } else {
            console.log('XLS radio button not found');
          }
        });
        

        await page.waitForSelector('#submitbtn');
        await page.click('#submitbtn');

        await delay(5000);  // Wait for the report to generate
        return
      }catch(err){
        throw(err)
      }
    }

    async itemReportExcelData(): Promise<void> {
      const downloadsPath = path.resolve('C:/Users/venka/Downloads');
    
      // Step 1: Get all files in the Downloads directory
      const files = fs.readdirSync(downloadsPath);
    
      // Step 2: Filter files that match the "ItemResponsibleReport" pattern
      const reportFiles = files.filter(file => file.startsWith('ItemResponsibleReport') && file.endsWith('.xls'));
    
      if (reportFiles.length === 0) {
        throw new Error('No ItemResponsibleReport files found in the Downloads directory.');
      }
    
      // Step 3: Sort the files based on the numerical suffix
      reportFiles.sort((a, b) => {
        const aMatch = a.match(/ItemResponsibleReport(?: \((\d+)\))?\.xls/);
        const bMatch = b.match(/ItemResponsibleReport(?: \((\d+)\))?\.xls/);
    
        const aNum = aMatch && aMatch[1] ? parseInt(aMatch[1], 10) : 0;
        const bNum = bMatch && bMatch[1] ? parseInt(bMatch[1], 10) : 0;
    
        return bNum - aNum;
      });
    
      // Step 4: Pick the latest file
      const latestReportFile = reportFiles[0];
      const filePath = path.join(downloadsPath, latestReportFile);
      console.log(filePath, '-----------');
      
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error('Worksheet not found in the Excel file.');
        }
      
        const entitiesToSave: ItemExcelEntity[] = [];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
        // Step 5: Fetch existing invoice numbers from the database
        // const existingInvoices = await this.iemExcelRepo.find({
        //   select: ['itemCode'],
        // });
        // const existingInvoicePOCombinations = new Set(existingInvoices.map(inv => `${inv.itemCode}`));
      
        for (const [rowNumber, row] of rows.entries()) {
          if (rowNumber > 2) {
            console.log(row[5], 'itemcode', row[6])
            const cell5 = row[5];
            const itemCode = cell5 ? cell5.toString().trim() : '';
            // Skip rows with null or empty itemCode
            if (!itemCode) {
              continue;
            }
      
            const cell7 = row[7];
            const itemDesc = cell7 ? cell7.toString() : ''
      
            const cell8 = row[8];
            const salesPerson = cell8 ? cell8.toString() : ''
      
            const cell9 = row[9];
            const m3ItemRes = cell9 ? cell9.toString() : ''
      
            const cell10 = row[10];
            const crmItemRes = cell10 ? cell10.toString() : ''
      
            const cell11 = row[11];
            const approver = cell11 ? cell11.toString() : ''
      
            const cell12 = row[12];
            const prodMerchant = cell12 ? cell12.toString() : ''
      
            const cell13 = row[13];
            const pdMerchant = cell13 ? cell13.toString() : ''
      
            const cell14 = row[14];
            const lastModifiedBy = cell14 ? cell14.toString() : ''
      
            const cell16 = row[16];
            const brand = cell16 ? cell16.toString() : ''
      
            const cell17 = row[17];
            const buyerCode = cell17 ? cell17.toString() : ''
      
            const cell18 = row[18];
            const buyerName = cell18 ? cell18.toString() : ''
      
            const buyerData = await this.buyerRepo.find({where:{buyerCode: buyerCode}});
            const entity = new ItemExcelEntity();
            entity.itemCode = itemCode
            entity.itemDescription = itemDesc
            entity.salesPerson = salesPerson
            entity.crmItemRes = crmItemRes
            entity.m3ItemRes = m3ItemRes
            entity.prodMerchant = prodMerchant
            entity.pdMerchant = pdMerchant
            entity.lastModifiedBy = lastModifiedBy
            entity.coApprover = approver
            entity.brand = brand
            entity.buyerCode = buyerCode
            entity.buyerName = buyerName
            entitiesToSave.push(entity);
          }
        }
      
        // Step 7: Save only unique invoice numbers
        if (entitiesToSave.length > 0) {
          await this.iemExcelRepo.save(entitiesToSave);
        }
    }

    async poItemReportExcelData(): Promise<void> {
      const downloadsPath = path.resolve('C:/Users/venka/Downloads');
    
      // Step 1: Get all files in the Downloads directory
      const files = fs.readdirSync(downloadsPath);
    
      // Step 2: Filter files that match the "ItemResponsibleReport" pattern
      const reportFiles = files.filter(file => file.startsWith('InspectionReport') && file.endsWith('.xls'));
    
      if (reportFiles.length === 0) {
        throw new Error('No ItemResponsibleReport files found in the Downloads directory.');
      }
    
      // Step 3: Sort the files based on the numerical suffix
      reportFiles.sort((a, b) => {
        const aMatch = a.match(/ItemResponsibleReport(?: \((\d+)\))?\.xls/);
        const bMatch = b.match(/ItemResponsibleReport(?: \((\d+)\))?\.xls/);
    
        const aNum = aMatch && aMatch[1] ? parseInt(aMatch[1], 10) : 0;
        const bNum = bMatch && bMatch[1] ? parseInt(bMatch[1], 10) : 0;
    
        return bNum - aNum;
      });
    
      // Step 4: Pick the latest file
      const latestReportFile = reportFiles[0];
      const filePath = path.join(downloadsPath, latestReportFile);
      
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error('Worksheet not found in the Excel file.');
        }
      
        const entitiesToSave: POItemExcelEntity[] = [];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const excelDateToJSDate = (serial)=> {
          const utc_days = Math.floor(serial - 25569);
          const utc_value = utc_days * 86400;                                        
          const date_info = new Date(utc_value * 1000);
          console.log(new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate()),'...........................')
          return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
        }
      
        for (const [rowNumber, col] of rows.entries()) {
          if (rowNumber > 3) {

            const cell0 = col[0];
            const itemNo = cell0 ? cell0.toString().trim().replace(/\s+/g, ' ') : '';
            if (!itemNo) {
              continue;
            }
      
            const cell1 = col[1];
            const itemName = cell1 ? cell1.toString() : ''
      
            const cell2 = col[2];
            const fabricCode = cell2 ? cell2.toString() : ''
      
            const cell3 = col[3];
            const sectorName = cell3 ? cell3.toString() : ''
      
            const cell4 = col[4];
            const poNo = cell4 ? cell4.toString() : ''
      
            const cell5 = col[5];
            const supplierName = cell5 ? cell5.toString().trim().replace(/\s+/g, ' ') : '';
            
            const cell6 = col[6];
            const supplierState = cell6 ? cell6.toString().trim().replace(/\s+/g, ' ') : '';
            
            const cell7 = col[7];
            const deliveryState = cell7 ? cell7.toString().trim().replace(/\s+/g, ' ') : '';
                  
            const cell9 = col[9];
            const grnNo = cell9 ? cell9.toString() : ''
      
            const cell10 = col[10];
            const grnQty = cell10 ? cell10.toString() : ''
      
            const cell11 = col[11];
            const invoiceNoDate = cell11 ? cell11.toString() : ''
      
            // const cell12 = col[12];
            // const m3GrnReceiveDate = cell12 ? excelDateToJSDate(cell12).toISOString().slice(0, 10) : ''

            // const cell13 = col[13];
            // const inspectionDate = cell13 ? excelDateToJSDate(cell13).toISOString().slice(0, 10) : ''
      
            // const cell14 = col[14];
            // const inspectionDays = cell14 ? cell14.toString() : ''
      
            // const cell15 = col[15];
            // const putAwayDate = cell15 ? excelDateToJSDate(cell15).toISOString().slice(0, 10) : ''
      
            // const cell16 = col[16];
            // const putAwayDays = cell16 ? cell16.toString() : ''
      
            const cell17 = col[17];
            const garmentItemRes = cell17 ? cell17.toString() : ''
      
            const cell18 = col[18];
            const buyer = cell18 ? cell18.toString() : ''
      
            const cell22 = col[22];
            const transportMode = cell22 ? cell22.toString() : ''
      
            const entity = new POItemExcelEntity();
            entity.itemNo = itemNo
            entity.itemName = itemName
            entity.fabricCode = fabricCode
            entity.sectorName = sectorName
            entity.poNo = poNo
            entity.supplierName = supplierName
            entity.supplierState = supplierState
            entity.deliveryState = deliveryState
            entity.grnNo = grnNo
            entity.grnQty = grnQty
            entity.invoiceNoDate = invoiceNoDate
            // entity.m3GrnReceiveDate = m3GrnReceiveDate
            // entity.inspectionDate = inspectionDate
            // entity.inspectionDays = inspectionDays
            // entity.putAwayDate = putAwayDate
            // entity.putAwayDays = putAwayDays
            entity.garmentItemRes = garmentItemRes
            entity.buyer = buyer
            entity.transportMode = transportMode
            entitiesToSave.push(entity);
          }
        }
        console.log(entitiesToSave.slice(0,10),'00000')
      
        // Step 7: Save only unique invoice numbers
        if (entitiesToSave.length > 0) {
          await this.poItemRepo.save(entitiesToSave);
        }
    }


  async getItemCodesByBuyer(req: BuyerReq):Promise<CommonResponseModel>{
    try{
        let query = `
        SELECT item_code AS itemCode,item_description as itemDesc,buyer_name AS buyerName, buyer_code AS buyerCode FROM item_excel
        WHERE 1=1`
        if (req.buyerName) {
          query = query + ` AND LOWER(buyer_name) = LOWER('${req.buyerName}')`;
        }
        if (req.buyerCode) {
          query = query + ` And buyer_code = '${req.buyerCode}'`;
        }
      
        const data = await this.dataSource.query(query)
        console.log(data,'-------------')
        if(data.length > 0){
          return new CommonResponseModel(true,1,'Data retrieved',data)
        }else{
          return new CommonResponseModel(false,0,'No data',[])
        }
    }catch(err){
      throw(err)
    }
  }

  async getItemDesByCode(req: BuyerReq):Promise<CommonResponseModel>{
    try{
        let query = `
        SELECT item_code AS itemCode,item_description as itemDesc FROM item_excel
        WHERE item_Code = '${req.buyerCode}'`
      
        const data = await this.dataSource.query(query)
        if(data.length > 0){
          return new CommonResponseModel(true,1,'Data retrieved',data)
        }else{
          return new CommonResponseModel(false,0,'No data',[])
        }
    }catch(err){
      throw(err)
    }
  }

  async getPODataByItemCode(req: BuyerReq):Promise<CommonResponseModel>{
    try{
        let query = `
        SELECT item_no AS itemNo, po_no AS poNo,supplier_name AS supplierName, grn_no AS grnNo,invoice_no as invoiceNo
        FROM po_item_excel
        WHERE item_no LIKE('${req.buyerCode}%')
        GROUP BY po_no`
      
        const data = await this.dataSource.query(query)
        if(data.length > 0){
          return new CommonResponseModel(true,1,'Data retrieved',data)
        }else{
          return new CommonResponseModel(false,0,'No data',[])
        }
    }catch(err){
      throw(err)
    }
  }

  async getGrnByPo(req: BuyerReq):Promise<CommonResponseModel>{
    try{
        let query = `
        SELECT item_no AS itemNo, po_no AS poNo,supplier_name AS supplierName, grn_no AS grnNo,invoice_no as invoiceNo
        FROM po_item_excel
        WHERE item_no LIKE('${req.buyerCode}%')
        GROUP BY po_no`
      
        const data = await this.dataSource.query(query)
        if(data.length > 0){
          return new CommonResponseModel(true,1,'Data retrieved',data)
        }else{
          return new CommonResponseModel(false,0,'No data',[])
        }
    }catch(err){
      throw(err)
    }
  }
}