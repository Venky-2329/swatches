import { Module } from "@nestjs/common";
import { BrandsController } from "./brands.controller";
import { BrandsService } from "./brands.service";
import { BrandsEntityRepository } from "./entity/brands.repo";

@Module({
    providers : [BrandsService,BrandsEntityRepository],
    controllers :[BrandsController]
})
export class BrandsModule{}