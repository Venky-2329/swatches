import { Module } from "@nestjs/common";
import { BrandsService } from "../brands/brands.service";
import { SeasonService } from "./season.service";
import { SeasonController } from "./season.controller";
import { SeasonEntityRepository } from "./entity/season.repo";
@Module({
    providers : [SeasonService,SeasonEntityRepository],
    controllers :[SeasonController]
})
export class SeasonModule{}