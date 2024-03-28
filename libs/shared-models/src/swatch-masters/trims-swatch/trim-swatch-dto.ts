import { StatusEnum } from "../../enums"

export class TrimSwatchDto{
    trimSwatchId : number
    trimSwatchNumber : string
    buyerId : number
    supplierId : number
    poNumber: string
    itemNo: string
    itemDescription: string
    invoiceNo: string
    styleNo: string
    grnNumber: string
    grnDate: Date
    fileName: string;
    filePath: string;
    status: StatusEnum
    createdAt?: Date
    createdUser?: string | null
    updatedAt?: Date
    updatedUser?: string | null
    versionFlag?: number
    rejectionReason: string
    approverId: number


    constructor(
    trimSwatchId : number,
    trimSwatchNumber : string,
    buyerId : number,
    supplierId : number,
    poNumber: string,
    itemNo: string,
    itemDescription: string,
    invoiceNo: string,
    styleNo: string,
    grnNumber: string,
    grnDate: Date,
    fileName: string,
    filePath: string,
    status: StatusEnum,
    createdAt?: Date,
    createdUser?: string | null,
    updatedAt?: Date,
    updatedUser?: string | null,
    versionFlag?: number,
    rejectionReason?: string,
    approverId?: number,

    ){
        this.trimSwatchId = trimSwatchId
        this.trimSwatchNumber = trimSwatchNumber
        this.buyerId = buyerId
        this.supplierId = supplierId
        this.poNumber = poNumber
        this.itemNo = itemNo
        this.itemDescription = itemDescription
        this.invoiceNo = invoiceNo
        this.styleNo = styleNo
        this.grnNumber = grnNumber
        this.grnDate = grnDate
        this.fileName = fileName
        this.filePath = filePath
        this.status = status
        this.createdAt = createdAt
        this.createdUser = createdUser
        this.updatedAt = updatedAt
        this.updatedUser = updatedUser
        this.versionFlag = versionFlag
        this.rejectionReason = rejectionReason
        this.approverId = approverId
    }

}