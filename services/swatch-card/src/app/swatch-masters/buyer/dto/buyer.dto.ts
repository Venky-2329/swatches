import { ApiProperty } from "@nestjs/swagger";

export class BuyerDto {
    @ApiProperty()
    buyerId:number;

    @ApiProperty()
    buyerName:string;

    @ApiProperty()
    createdUser: string;

    @ApiProperty()
    updatedUser: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt : Date;

  }
  