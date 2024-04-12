import { StatusEnum } from "../../enums";

export class TrimCardReq{
    buyerId: number;
    grnNo: string;
    supplierId : number;
    poNo: string;
    styleNo: string;
    itemNo: string;
    approverId : number;
}

export class ReportReq{
    swatchNumber : string
    fromDate : any
    toDate : any
    approverId: number
    createdUser?: string | null
    status: StatusEnum
}