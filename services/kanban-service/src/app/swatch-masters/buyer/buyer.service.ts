import { Injectable } from '@nestjs/common';
import { BuyerDto } from './dto/buyer.dto';

@Injectable()
export class BuyerService {
  create(BuyerDto: BuyerDto) {
    return 'This action adds a new buyer';
  }


  remove(id: number) {
    return `This action removes a #${id} buyer`;
  }
}
