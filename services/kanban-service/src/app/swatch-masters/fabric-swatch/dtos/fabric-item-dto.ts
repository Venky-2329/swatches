import { ApiProperty } from "@nestjs/swagger";

export class FabricItemDto{
    @ApiProperty()
    fabricItemId:number
    @ApiProperty()
    itemNo: string;
    @ApiProperty()
    itemDescription: string;
    @ApiProperty()
    createdAt: string;
    @ApiProperty()
    fabricSwatchId
}