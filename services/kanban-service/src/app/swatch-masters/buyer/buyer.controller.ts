import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerDto } from './dto/buyer.dto';

@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post()
  create(@Body() BuyerDto: BuyerDto) {
    return this.buyerService.create(BuyerDto);
  }

}
