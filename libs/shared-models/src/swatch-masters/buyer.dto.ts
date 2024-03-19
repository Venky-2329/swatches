export class BuyerDto {
  buyerId: number;
  buyerName: string;
  createdUser: string;
  updatedUser: string;
  isActive : boolean;
  createdAt : Date;
  constructor(
    buyerId: number,
    buyerName: string,
    createdUser: string,
    updatedUser: string,
    isActive : boolean,
    createdAt : Date
  ) {
    this.buyerId = buyerId;
    this.buyerName = buyerName;
    this.createdUser = createdUser;
    this.updatedUser = updatedUser;
    this.isActive = isActive;
    this.createdAt = createdAt
  }
}
