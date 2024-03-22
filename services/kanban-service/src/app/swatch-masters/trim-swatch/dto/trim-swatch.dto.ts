import { ApiProperty } from "@nestjs/swagger";
import { StatusEnum } from "libs/shared-models";

export class TrimSwatchDto {
    @ApiProperty()
    trimSwatchId : number

    @ApiProperty()
    trimSwatchNumber : string

    @ApiProperty()
    buyerId : number

    @ApiProperty()
    suppplierId : number

    @ApiProperty()
    poNumber: string

    @ApiProperty()
    itemNo: string

    @ApiProperty()
    itemDescription: string

    @ApiProperty()
    invoiceNo: string

    @ApiProperty()
    styleNo: string
    
    @ApiProperty()
    merchant: string
    
    @ApiProperty()
    grnNumber: string

    @ApiProperty()
    grnDate: Date

    @ApiProperty()
    checkedBy: string

    @ApiProperty()
    fileName: string;

    @ApiProperty()
    filePath: string;

    @ApiProperty()
    status: StatusEnum

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    createdUser: string | null

    @ApiProperty()
    updatedAt: Date

    @ApiProperty()
    updatedUser: string | null

    @ApiProperty()
    versionFlag: number

}
