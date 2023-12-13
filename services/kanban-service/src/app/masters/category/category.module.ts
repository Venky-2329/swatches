import { Module } from "@nestjs/common";
import { BrandsService } from "../brands/brands.service";
import { CategoryEntityRepository } from "./entity/category.repo";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
    providers : [CategoryService,CategoryEntityRepository],
    controllers :[CategoryController]
})
export class CategoryModule{}