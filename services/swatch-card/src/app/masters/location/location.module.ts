import { Module } from "@nestjs/common";
import { LocationEntityRepository } from "./entity/location.repo";
import { LocationService } from "./location.service";
import { LocationController } from "./location.controller";

@Module({
    providers : [LocationService,LocationEntityRepository],
    controllers :[LocationController]
})
export class LocationModule{}