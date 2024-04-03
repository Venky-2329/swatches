import { ApiProperty } from "@nestjs/swagger"
import { StatusEnum } from "libs/shared-models"
import { FabricUploadDto } from "./fabric-upload.dto"

export class FabricSwatchDto{
    @ApiProperty()
    fabricSwatchId: number
    @ApiProperty()
    fabricSwatchNumber: string
    @ApiProperty()
    buyerId: number
    @ApiProperty()
    brandId: number
    @ApiProperty()
    styleNo: string
    @ApiProperty()
    itemNo: string
    @ApiProperty()
    itemDescription: string
    @ApiProperty()
    categoryType: string
    @ApiProperty()
    categoryId: number
    @ApiProperty()
    seasonId: number
    @ApiProperty()
    mill: string
    @ApiProperty()
    color: string
    @ApiProperty()
    poNumber: string
    @ApiProperty()
    grnNumber: string
    // @ApiProperty()
    // fileName: string;
    // @ApiProperty()
    // filePath: string;
    @ApiProperty()
    status: StatusEnum;
    @ApiProperty()
    grnDate: Date
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    createdUser: string | null
    @ApiProperty()
    createdUserMail: string | null
    @ApiProperty()
    updatedAt: Date
    @ApiProperty()
    updatedUser: string | null
    @ApiProperty()
    versionFlag: number
    @ApiProperty()
    approverId: number
    @ApiProperty({type:[FabricUploadDto]})
    uploadInfo: FabricUploadDto[]

}