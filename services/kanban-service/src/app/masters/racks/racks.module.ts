import { Module } from "@nestjs/common";
import { RacksService } from "./racks.service";
import { RacksController } from "./racks.controller";
import { RacksEntityRepository } from "./entity/racks.repo";
import { RacksChildEntityRepository } from "./entity/racks-child.repo";

@Module({
    providers : [RacksService,RacksEntityRepository,RacksChildEntityRepository],
    controllers :[RacksController]
})
export class RacksModule{}