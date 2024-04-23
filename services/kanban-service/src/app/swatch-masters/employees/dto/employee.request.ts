import { IsNotEmpty, IsAlphanumeric, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EmployeeRequest{
    employeeId: number;
    updatedUser: string;
    versionFlag: number;
    isActive: boolean;
}