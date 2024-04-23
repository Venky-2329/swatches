import { RoleEnum } from "../enums";

export class UserDto {
    userId: number;
    userName: string;
    password: string;
    employeeId: number;
    email: string;
    departmentId: number;
    role: RoleEnum;
    createdUser: string;
    updatedUser: string;
    isActive: boolean;

}

export class userReq {
    userId: number;
    isActive: boolean;
    updatedUser: string;

}