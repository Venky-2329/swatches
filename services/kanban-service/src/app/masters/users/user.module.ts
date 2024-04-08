import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UsersController } from "./user.controller";
import { UserEntityRepository } from "./entity/user.repo";

@Module({
    providers : [UserService,UserEntityRepository],
    controllers :[UsersController]
})
export class UsersModule{}