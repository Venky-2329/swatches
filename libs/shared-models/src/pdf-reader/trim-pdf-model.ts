import { TrimTypes } from "./trim-type.dto";

export class TrimPodfModel{
    style:string;
    season:string;
    pdfId: number;
    date: any;
    poNumber: string;
    quantity: string;
    itemNo: string;
    factory: string;
    wash: string;
    preparedBy: string;
    approvedBy: string;
    qaApproval: string;
    remarks: string;
    pdfFileName: string;
    pdfFilePath: string;
    trimTypes:TrimTypes[];
}