import { ApiProperty } from "@nestjs/swagger";

export class SupplierDto {

    @ApiProperty()
    supplierId : number;

    @ApiProperty()
    supplierName : string;

    @ApiProperty()
    createdUser : string;

    @ApiProperty()
    updatedUser : string;

    @ApiProperty()
    isActive : boolean;

    // @ApiProperty()
    // createdAt : Date;

    // @ApiProperty()
    // updatedAt : Date;

}
