import { StatusEnum } from "../../enums"

export class FabricSwatchDto{
    fabricSwatchId: number
    fabricSwatchNumber: string
    buyerId: number
    brandId: number
    styleNo: string
    itemNo: string
    itemDescription: string
    categoryType: string
    categoryId: number
    seasonId: number
    mill: string
    color: string
    poNumber: string
    grnNumber: string
    fileName: string;
    filePath: string;
    status: StatusEnum;
    grnDate: Date
    createdAt: Date
    createdUser: string | null
    updatedAt: Date
    updatedUser: string | null
    versionFlag: number

    constructor(
        fabricSwatchNumber: string,
        buyerId: number,
        brandId: number,
        styleNo: string,
        itemNo: string,
        itemDescription: string,
        categoryType: string,
        categoryId: number,
        seasonId: number,
        mill: string,
        color: string,
        poNumber: string,
        grnNumber: string,
        fileName: string,
        filePath: string,
        status: StatusEnum,
        grnDate: Date,
        createdAt?: Date,
        createdUser?: string | null,
        updatedAt?: Date,
        updatedUser?: string | null,
        versionFlag?: number,
        fabricSwatchId?: number,
    ){
        this.fabricSwatchId = fabricSwatchId
        this.fabricSwatchNumber = fabricSwatchNumber
        this.buyerId = buyerId
        this.brandId = brandId
        this.styleNo = styleNo
        this.itemNo = itemNo
        this.itemDescription = itemDescription
        this.categoryType = categoryType
        this.categoryId = categoryId
        this.seasonId = seasonId
        this.mill = mill
        this.color = color
        this.poNumber = poNumber
        this.grnNumber = grnNumber
        this.fileName = fileName
        this.filePath = filePath
        this.status = status
        this.grnDate = grnDate
        this.createdAt = createdAt
        this.createdUser = createdUser
        this.updatedAt = updatedAt
        this.updatedUser = updatedUser
        this.versionFlag = versionFlag
    }

}