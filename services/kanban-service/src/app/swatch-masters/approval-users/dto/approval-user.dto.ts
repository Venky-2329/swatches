import { ApiProperty } from "@nestjs/swagger";

export class ApprovalUserDto {
    @ApiProperty()
    approvedId: number;
  
    @ApiProperty()
    userId: string;
  
    @ApiProperty()
    emailId: string;
  
    @ApiProperty()
    signImageName: string;
  
    @ApiProperty()
    signPath: string;
  
    @ApiProperty()
    isActive: boolean;
  
    @ApiProperty()
    createdAt : Date;
  
    @ApiProperty()
    createdUser : string;
  
    @ApiProperty()
    versionFlag : number;
}
