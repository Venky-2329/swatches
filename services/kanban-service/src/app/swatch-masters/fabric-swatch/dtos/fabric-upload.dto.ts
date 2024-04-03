import { ApiProperty } from "@nestjs/swagger";

export class FabricUploadDto{
    @ApiProperty()
    uploadId:number
    @ApiProperty()
    fileName: string;
    @ApiProperty()
    filePath: string;
    @ApiProperty()
    createdAt: string;
    @ApiProperty()
    fabricSwatchId
}